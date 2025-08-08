import { z } from 'zod'
import { prisma } from '../utils/prisma'

const CreateGuestSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional().or(z.literal('')),
  category: z.enum(['Amigos', 'Creche', 'Familia', 'Padrinhos']),
  referenceCode: z.string().min(1),
  kidAge: z.number().optional(),
  maleKid: z.boolean().optional(),
  dietary: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
  status: z.enum(['REGISTERED', 'CONFIRMED', 'ATTENDED']).default('REGISTERED')
})

export default defineEventHandler(async (event) => {
  // Only allow POST requests
  if (getMethod(event) !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed'
    })
  }

  try {
    const body = await readBody(event)
    console.log('Received body:', body)
    
    // Validate input
    const validatedData = CreateGuestSchema.parse(body)
    console.log('Validated data:', validatedData)
    
    // Check if there's already a guest with the same referenceCode to reuse invite code
    const existingGuestWithSameRef = await prisma.guest.findFirst({
      where: { referenceCode: validatedData.referenceCode }
    })
    
    let inviteCode: string
    
    if (existingGuestWithSameRef) {
      // Reuse the existing invite code for the same reference group
      inviteCode = existingGuestWithSameRef.inviteCode
    } else {
      // Generate a new unique invite code for new reference groups
      const generateInviteCode = () => Math.random().toString(36).substring(2, 8).toUpperCase()
      inviteCode = generateInviteCode()
      
      // Ensure the invite code is unique (check if it exists)
      let existingInvite = await prisma.guest.findFirst({
        where: { inviteCode }
      })
      
      // Keep generating until we get a unique code
      while (existingInvite) {
        inviteCode = generateInviteCode()
        existingInvite = await prisma.guest.findFirst({
          where: { inviteCode }
        })
      }
    }
    
    // Check if guest name already exists (since name is unique)
    const existingGuest = await prisma.guest.findUnique({
      where: { name: validatedData.name }
    })
    
    if (existingGuest) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Nome do convidado já existe'
      })
    }
    
    // Create guest
    const guest = await prisma.guest.create({
      data: {
        name: validatedData.name,
        email: validatedData.email && validatedData.email.trim() ? validatedData.email : null,
        category: validatedData.category,
        referenceCode: validatedData.referenceCode,
        inviteCode: inviteCode,
        kidAge: validatedData.kidAge || null,
        maleKid: validatedData.maleKid || false,
        dietary: validatedData.dietary && validatedData.dietary.trim() ? validatedData.dietary : null,
        notes: validatedData.notes && validatedData.notes.trim() ? validatedData.notes : null,
        status: validatedData.status
      }
    })

    console.log('Created guest:', guest)

    return {
      success: true,
      guest
    }

  } catch (error: any) {
    console.error('Create guest error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor'
    })
  }
})
