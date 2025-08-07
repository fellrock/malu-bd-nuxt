import { z } from 'zod'
import { prisma } from '../utils/prisma'
import { Status } from '@prisma/client'

const ChangeToPendingSchema = z.object({
  inviteCode: z.string().min(6).max(6),
  guestIds: z.array(z.string()).min(1)
})

export default defineEventHandler(async (event) => {
    // Only allow POST requests
    if (event.method !== 'POST') {
        throw createError({
            statusCode: 405,
            statusMessage: 'Method Not Allowed'
        })
    }

    try {
        const body = await readBody(event)
        const validatedData = ChangeToPendingSchema.parse(body)

        // Verify the invite code exists and get associated guests
        const existingGuests = await prisma.guest.findMany({
        where: {
            inviteCode: validatedData.inviteCode,
            id: { in: validatedData.guestIds }
        }
        })

        if (existingGuests.length === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Nenhum convidado encontrado com o código fornecido'
        })
        }

        // Change status to PENDING for the specified guests
        const updatedGuests = await prisma.guest.updateMany({
        where: {
            inviteCode: validatedData.inviteCode,
            id: { in: validatedData.guestIds }
        },
        data: {
            status: 'PENDING' as Status
        }
        })

        return {
        success: true,
        message: `${updatedGuests.count} convidado(s) alterado(s) para status PENDING`,
        updatedCount: updatedGuests.count
        }

    } catch (error: any) {
        console.error('Change to pending error:', error)
        
        if (error.name === 'ZodError') {
        throw createError({
            statusCode: 400,
            statusMessage: 'Dados inválidos: ' + error.errors.map((e: any) => e.message).join(', ')
        })
        }
        
        if (error.statusCode) {
        throw error
        }
        
        throw createError({
        statusCode: 500,
        statusMessage: 'Erro interno do servidor'
        })
    }
})
