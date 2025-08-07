import { z } from 'zod'
import { prisma } from '../utils/prisma'

// Validation schema for cancellation
const cancelSchema = z.object({
  guestIds: z.array(z.string()).min(1, 'Pelo menos um convidado deve ser selecionado'),
  reason: z.string().optional()
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
    const validatedData = cancelSchema.parse(body)

    // Update guests to mark them as cancelled
    const cancelledGuests = await prisma.guest.updateMany({
      where: {
        id: {
          in: validatedData.guestIds
        },
        status: { not: 'CANCELLED' as any } // Only cancel non-cancelled guests
      },
      data: {
        status: 'CANCELLED' as any,
        notes: validatedData.reason 
          ? `Cancelado: ${validatedData.reason}` 
          : 'Cancelado pelo usuário'
      }
    })

    return {
      success: true,
      message: `${cancelledGuests.count} convidado(s) cancelado(s) com sucesso!`,
      cancelledCount: cancelledGuests.count
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

    // Handle other errors
    console.error('Guest cancellation error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor'
    })
  }
})
