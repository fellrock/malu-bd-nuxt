/**
 * API Endpoint: /api/update-guest-data
 * 
 * Updates guest information for CONFIRMED guests (keeps CONFIRMED status)
 */

import { z } from 'zod'
import { prisma } from '../utils/prisma'

// Guest data validation schema  
const GuestDataSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.string().email().optional().or(z.literal('')),
  dietary: z.string().optional(),
  notes: z.string().optional(),
  kidAge: z.number().int().min(0).max(18).optional(),
  maleKid: z.boolean().optional()
})

const UpdateGuestDataSchema = z.object({
  inviteCode: z.string().min(6).max(6),
  guests: z.array(GuestDataSchema).min(1)
})

export default defineEventHandler(async (event) => {
  try {
    // Only allow POST requests
    assertMethod(event, 'POST')
    
    // Parse and validate request body
    const body = await readBody(event)
    const { inviteCode, guests } = UpdateGuestDataSchema.parse(body)
    
    // Validate invite code exists and guests are in CONFIRMED status
    const existingGuests = await prisma.guest.findMany({
      where: { 
        inviteCode,
        status: 'CONFIRMED' as any // Only allow this operation on CONFIRMED guests
      },
      select: { id: true, name: true, status: true }
    })
    
    if (existingGuests.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Convite não encontrado ou não está confirmado'
      })
    }
    
    // Validate that all provided guest IDs exist in the invitation
    const existingGuestIds = new Set(existingGuests.map(g => g.id))
    const providedGuestIds = new Set(guests.map(g => g.id))
    
    // Check if all provided guests exist
    for (const guestId of providedGuestIds) {
      if (!existingGuestIds.has(guestId)) {
        throw createError({
          statusCode: 400,
          statusMessage: `Convidado com ID ${guestId} não encontrado neste convite`
        })
      }
    }
    
    // Update guest data (keep CONFIRMED status)
    const updatedGuests = await prisma.$transaction(async (tx: any) => {
      const results = []
      
      // Update each guest's data
      for (const guestData of guests) {
        // Get current data to compare changes
        const currentGuest = await tx.guest.findUnique({
          where: { id: guestData.id },
          select: { 
            name: true, 
            email: true, 
            dietary: true, 
            notes: true, 
            kidAge: true, 
            maleKid: true 
          }
        })
        
        const updatedGuest = await tx.guest.update({
          where: { id: guestData.id },
          data: {
            name: guestData.name,
            email: guestData.email || null,
            dietary: guestData.dietary || null,
            notes: guestData.notes || null,
            kidAge: guestData.kidAge || null,
            maleKid: guestData.maleKid || false
            // Note: status remains CONFIRMED
          }
        })
        
        // Create status log for data update (keeps same status)
        await tx.guestStatusLog.create({
          data: {
            guestId: guestData.id,
            fromStatus: 'CONFIRMED',
            toStatus: 'CONFIRMED',
            reason: 'data_updated'
          }
        })
        
        results.push(updatedGuest)
      }
      
      return results
    })
    
    return {
      success: true,
      message: 'Dados atualizados com sucesso!',
      nextStep: 'updated',
      guestsUpdated: updatedGuests.length,
      guests: updatedGuests.map(guest => ({
        id: guest.id,
        name: guest.name,
        status: guest.status
      }))
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
    
    // Handle custom errors
    if (error instanceof Error && error.message.includes('not found')) {
      throw createError({
        statusCode: 404,
        statusMessage: error.message
      })
    }
    
    // Handle other errors
    console.error('Update guest data error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor'
    })
  }
})
