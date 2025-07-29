import { z } from 'zod'
import { prisma } from '../utils/prisma'

// Validation schema for RSVP submission
const rsvpSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  guests: z.number().min(1, 'Número de pessoas é obrigatório').max(10, 'Máximo 10 pessoas'),
  dietary: z.string().optional(),
  notes: z.string().optional()
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
    // Parse and validate request body
    const body = await readBody(event)
    const validatedData = rsvpSchema.parse(body)

    // Generate a unique 6-digit invitation code
    const generateInviteCode = () => {
      return Math.random().toString(36).substring(2, 8).toUpperCase()
    }

    let inviteCode = generateInviteCode()
    
    // Ensure invite code is unique by checking existing codes
    let existingGuest = await prisma.guest.findFirst({
      where: { inviteCode }
    })
    
    while (existingGuest) {
      inviteCode = generateInviteCode()
      existingGuest = await prisma.guest.findFirst({
        where: { inviteCode }
      })
    }

    // Create guest record
    const guest = await prisma.guest.create({
      data: {
        name: validatedData.name,
        email: validatedData.email || `guest-${inviteCode.toLowerCase()}@temp.com`,
        inviteCode,
        plusOnes: validatedData.guests - 1, // Total guests minus the main guest
        dietary: validatedData.dietary || null,
        notes: validatedData.notes || null,
        status: 'CONFIRMED'
      }
    })

    // Return success response with invite code
    return {
      success: true,
      message: 'Presença confirmada com sucesso!',
      data: {
        id: guest.id,
        inviteCode: guest.inviteCode,
        name: guest.name,
        totalGuests: validatedData.guests
      }
    }

  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Dados inválidos',
        data: error.issues
      })
    }

    // Handle Prisma errors
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      throw createError({
        statusCode: 409,
        statusMessage: 'E-mail já cadastrado'
      })
    }

    // Handle other errors
    console.error('RSVP submission error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor'
    })
  }
})
