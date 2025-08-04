import { z } from 'zod'
import { prisma } from '../utils/prisma'

// Validation schema for guest updates
const guestSchema = z.object({
  id: z.string().optional(), // For updates
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  dietary: z.string().optional(),
  notes: z.string().optional(),
  kidAge: z.number().optional(),
  maleKid: z.boolean().optional(),
  status: z.enum(['REGISTERED', 'CONFIRMED', 'ATTENDED']).default('CONFIRMED')
})

const groupUpdateSchema = z.object({
  inviteCode: z.string().min(1, 'Código de convite é obrigatório'),
  guests: z.array(guestSchema),
  referenceCode: z.string().min(1, 'Código de referência é obrigatório'),
  category: z.enum(['Amigos', 'Creche', 'Familia', 'Padrinhos'])
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
    // Parse and validate request body
    const body = await readBody(event)
    const validatedData = groupUpdateSchema.parse(body)

    const updatedGuests = []

    for (const guestData of validatedData.guests) {
      if (guestData.id) {
        // Update existing guest
        const updatedGuest = await prisma.guest.update({
          where: { id: guestData.id },
          data: {
            name: guestData.name,
            email: guestData.email || null,
            dietary: guestData.dietary || null,
            notes: guestData.notes || null,
            kidAge: guestData.kidAge || null,
            maleKid: guestData.maleKid || false,
            status: guestData.status,
            referenceCode: validatedData.referenceCode,
            category: validatedData.category
          }
        })
        updatedGuests.push(updatedGuest)
      } else {
        // Create new guest
        const newGuest = await prisma.guest.create({
          data: {
            name: guestData.name,
            email: guestData.email || null,
            inviteCode: validatedData.inviteCode,
            dietary: guestData.dietary || null,
            notes: guestData.notes || null,
            kidAge: guestData.kidAge || null,
            maleKid: guestData.maleKid || false,
            status: guestData.status,
            referenceCode: validatedData.referenceCode,
            category: validatedData.category
          }
        })
        updatedGuests.push(newGuest)
      }
    }

    return {
      success: true,
      message: 'Convidados atualizados com sucesso!',
      guests: updatedGuests
    }

  } catch (error: any) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Dados inválidos',
        data: error.issues
      })
    }

    // Handle Prisma errors
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2002') {
        throw createError({
          statusCode: 409,
          statusMessage: 'Nome já cadastrado'
        })
      }
      if (error.code === 'P2025') {
        throw createError({
          statusCode: 404,
          statusMessage: 'Convidado não encontrado'
        })
      }
    }

    // Handle other errors
    console.error('Group update error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor'
    })
  }
})
