import { z } from 'zod'
import { prisma } from '../../utils/prisma'

const UpdateGuestSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  category: z.enum(['Amigos', 'Creche', 'Familia', 'Padrinhos']).optional(),
  referenceCode: z.string().min(1).optional(),
  inviteCode: z.string().min(1).optional(),
  kidAge: z.number().optional(),
  maleKid: z.boolean().optional(),
  dietary: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['REGISTERED', 'CONFIRMED', 'ATTENDED']).optional()
})

export default defineEventHandler(async (event) => {
  // Only allow PUT requests
  if (getMethod(event) !== 'PUT') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed'
    })
  }

  try {
    const guestId = getRouterParam(event, 'id')
    
    if (!guestId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID do convidado é obrigatório'
      })
    }
    
    const body = await readBody(event)
    
    // Validate input
    const validatedData = UpdateGuestSchema.parse(body)
    
    // Check if guest exists
    const existingGuest = await prisma.guest.findUnique({
      where: { id: guestId }
    })
    
    if (!existingGuest) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Convidado não encontrado'
      })
    }
    
    // If updating name, check for conflicts
    if (validatedData.name && validatedData.name !== existingGuest.name) {
      const nameConflict = await prisma.guest.findUnique({
        where: { name: validatedData.name }
      })
      
      if (nameConflict) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Nome do convidado já existe'
        })
      }
    }
    
    // Handle invite code consistency when reference code changes
    let finalInviteCode = validatedData.inviteCode || existingGuest.inviteCode
    
    if (validatedData.referenceCode && validatedData.referenceCode !== existingGuest.referenceCode) {
      // Check if there's already a guest with the new referenceCode to reuse invite code
      const existingGuestWithNewRef = await prisma.guest.findFirst({
        where: { referenceCode: validatedData.referenceCode }
      })
      
      if (existingGuestWithNewRef) {
        // Reuse the existing invite code for the same reference group
        finalInviteCode = existingGuestWithNewRef.inviteCode
      } else {
        // Keep the current invite code if moving to a new reference group
        finalInviteCode = existingGuest.inviteCode
      }
    }
    
    // Update guest with only provided fields
    const updatedGuest = await prisma.guest.update({
      where: { id: guestId },
      data: {
        ...(validatedData.name && { name: validatedData.name }),
        ...(validatedData.email !== undefined && { email: validatedData.email || null }),
        ...(validatedData.category && { category: validatedData.category }),
        ...(validatedData.referenceCode && { referenceCode: validatedData.referenceCode }),
        inviteCode: finalInviteCode, // Always set the correct invite code
        ...(validatedData.kidAge !== undefined && { kidAge: validatedData.kidAge || null }),
        ...(validatedData.maleKid !== undefined && { maleKid: validatedData.maleKid }),
        ...(validatedData.dietary !== undefined && { dietary: validatedData.dietary || null }),
        ...(validatedData.notes !== undefined && { notes: validatedData.notes || null }),
        ...(validatedData.status && { status: validatedData.status })
      }
    })

    return {
      success: true,
      guest: updatedGuest
    }

  } catch (error: any) {
    console.error('Update guest error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor'
    })
  }
})
