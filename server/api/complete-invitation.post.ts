/**
 * API Endpoint: /api/complete-invitation
 * 
 * Handles data completion (PENDING → CONFIRMED) with complete guest information
 */

import { z } from 'zod'
import { changeGuestStatusByInviteCode } from '../utils/guest-status'
import { prisma } from '../utils/prisma'

// Guest data validation schema
const GuestDataSchema = z.object({
  id: z.string().nullable(), // Allow null for new guests
  name: z.string().min(1),
  email: z.string().email().optional().or(z.literal('')),
  dietary: z.string().optional(),
  notes: z.string().optional(),
  kidAge: z.number().int().min(0).max(18).optional(),
  maleKid: z.boolean().optional()
})

const CompleteInvitationSchema = z.object({
  inviteCode: z.string().min(6).max(6),
  guests: z.array(GuestDataSchema).min(1)
})

export default defineEventHandler(async (event) => {
  try {
    // Only allow POST requests
    assertMethod(event, 'POST')
    
    // Parse and validate request body
    const body = await readBody(event)
    const { inviteCode, guests } = CompleteInvitationSchema.parse(body)
    
    // Validate invite code exists and guests are in PENDING status
    const existingGuests = await prisma.guest.findMany({
      where: { 
        inviteCode,
        status: 'PENDING' as any // Only allow this operation on PENDING guests
      },
      select: { id: true, name: true, status: true, category: true, referenceCode: true }
    })
    
    if (existingGuests.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Convite não encontrado ou não está no estado correto para completar dados'
      })
    }
    
    // Separate existing guests from new guests
    const existingGuestIds = new Set(existingGuests.map(g => g.id))
    const guestsWithIds = guests.filter(g => g.id !== null)
    const newGuests = guests.filter(g => g.id === null)
    
    // Validate that all provided guest IDs exist in the invitation
    for (const guest of guestsWithIds) {
      if (!existingGuestIds.has(guest.id!)) {
        throw createError({
          statusCode: 400,
          statusMessage: `Convidado com ID ${guest.id} não encontrado neste convite`
        })
      }
    }
    
    // Update guest data and change status to CONFIRMED
    const updatedGuests = await prisma.$transaction(async (tx: any) => {
      const results = []
      
      // Get category and referenceCode from first existing guest for consistency
      const existingGuestSample = existingGuests[0]
      const inheritedCategory = existingGuestSample.category
      const inheritedReferenceCode = existingGuestSample.referenceCode
      
      // Update existing guests
      for (const guestData of guestsWithIds) {
        if (!guestData.id) {
          console.error('Guest data without ID in existing guests:', guestData)
          continue
        }
        
        const updatedGuest = await tx.guest.update({
          where: { id: guestData.id },
          data: {
            name: guestData.name,
            email: guestData.email || null,
            dietary: guestData.dietary || null,
            notes: guestData.notes || null,
            kidAge: guestData.kidAge || null,
            maleKid: guestData.maleKid || false,
            status: 'CONFIRMED'
          }
        })
        
        // Create status log
        await tx.guestStatusLog.create({
          data: {
            guestId: guestData.id,
            fromStatus: 'PENDING',
            toStatus: 'CONFIRMED',
            reason: 'data_completed'
          }
        })
        
        results.push(updatedGuest)
      }
      
      // Create new guests
      for (const guestData of newGuests) {
        const newGuest = await tx.guest.create({
          data: {
            inviteCode,
            name: guestData.name,
            email: guestData.email || null,
            dietary: guestData.dietary || null,
            notes: guestData.notes || null,
            kidAge: guestData.kidAge || null,
            maleKid: guestData.maleKid || false,
            status: 'CONFIRMED',
            category: inheritedCategory, // Use same category as existing guests
            referenceCode: inheritedReferenceCode // Use same reference code as existing guests
          }
        })
        
        // Create status log for new guest
        await tx.guestStatusLog.create({
          data: {
            guestId: newGuest.id,
            fromStatus: 'REGISTERED',
            toStatus: 'CONFIRMED',
            reason: 'new_guest_added_and_confirmed'
          }
        })
        
        results.push(newGuest)
      }
      
      return results
    })
    
    return {
      success: true,
      message: 'Dados salvos com sucesso! Sua presença está confirmada.',
      nextStep: 'confirmed',
      redirectTo: `/evento/${inviteCode}`,
      guestsUpdated: updatedGuests.length,
      guests: updatedGuests.map(guest => ({
        id: guest.id,
        name: guest.name,
        status: guest.status
      }))
    }
    
  } catch (error) {
    // Log the error for debugging
    console.error('Complete invitation error details:', {
      error,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : 'No stack trace'
    })
    
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Dados inválidos',
        data: error.issues
      })
    }
    
    // Handle custom errors
    if (error instanceof Error && error.message.includes('not found')) {
      throw createError({
        statusCode: 404,
        statusMessage: error.message
      })
    }
    
    // Handle other errors
    console.error('=== COMPLETE INVITATION ERROR DEBUG ===')
    console.error('Error object:', error)
    console.error('Error type:', typeof error)
    console.error('Error constructor:', error?.constructor?.name)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    console.error('=== END DEBUG ===')
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor'
    })
  }
})
