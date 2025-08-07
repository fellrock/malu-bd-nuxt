/**
 * API Endpoint: /api/invitation-response
 * 
 * Handles initial invitation acceptance (REGISTERED → PENDING) or rejection (REGISTERED → CANCELLED)
 */

import { z } from 'zod'
import { prisma } from '../utils/prisma'

// Request validation schema
const InvitationResponseSchema = z.object({
  inviteCode: z.string().min(6).max(6),
  action: z.enum(['ACCEPT', 'REJECT']),
  rejectionReason: z.string().optional()
})

export default defineEventHandler(async (event) => {
  try {
    // Only allow POST requests
    assertMethod(event, 'POST')
    
    // Parse and validate request body
    const body = await readBody(event)
    const { inviteCode, action, rejectionReason } = InvitationResponseSchema.parse(body)
    
    // Validate invite code exists and guests are in REGISTERED status
    const existingGuests = await prisma.guest.findMany({
      where: { 
        inviteCode,
        status: 'REGISTERED' as any // Only allow this operation on REGISTERED guests
      },
      select: { id: true, name: true, status: true }
    })
    
    if (existingGuests.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Convite não encontrado ou já processado'
      })
    }
    
    // Handle the action using direct Prisma transaction
    if (action === 'ACCEPT') {
      // Change status to PENDING
      const result = await prisma.$transaction(async (tx: any) => {
        const updatedGuests = []
        
        for (const guest of existingGuests) {
          // Update guest status
          const updatedGuest = await tx.guest.update({
            where: { id: guest.id },
            data: { status: 'PENDING' }
          })
          
          // Create status log
          await tx.guestStatusLog.create({
            data: {
              guestId: guest.id,
              fromStatus: 'REGISTERED',
              toStatus: 'PENDING',
              reason: 'invitation_accepted'
            }
          })
          
          updatedGuests.push(updatedGuest)
        }
        
        return { updatedCount: updatedGuests.length, guests: updatedGuests }
      })
      
      return {
        success: true,
        action: 'accepted',
        message: 'Convite aceito com sucesso! Agora complete seus dados.',
        nextStep: 'data_completion',
        redirectTo: `/convite/${inviteCode}`,
        guestsUpdated: result.updatedCount
      }
      
    } else if (action === 'REJECT') {
      // Change status to CANCELLED
      const result = await prisma.$transaction(async (tx: any) => {
        const updatedGuests = []
        
        for (const guest of existingGuests) {
          // Update guest status
          const updatedGuest = await tx.guest.update({
            where: { id: guest.id },
            data: { status: 'CANCELLED' }
          })
          
          // Create status log
          await tx.guestStatusLog.create({
            data: {
              guestId: guest.id,
              fromStatus: 'REGISTERED',
              toStatus: 'CANCELLED',
              reason: rejectionReason || 'invitation_rejected'
            }
          })
          
          updatedGuests.push(updatedGuest)
        }
        
        return { updatedCount: updatedGuests.length, guests: updatedGuests }
      })
      
      return {
        success: true,
        action: 'rejected',
        message: 'Agradecemos pela resposta. Sentiremos sua falta!',
        nextStep: 'completed',
        guestsUpdated: result.updatedCount
      }
    }
    
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Dados inválidos',
        data: error.issues
      })
    }
    
    // Handle custom errors from status service
    if (error instanceof Error && error.message.includes('not found')) {
      throw createError({
        statusCode: 404,
        statusMessage: error.message
      })
    }
    
    // Handle other errors
    console.error('Invitation response error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor'
    })
  }
})
