/**
 * Guest Status Management Service
 * 
 * Provides utilities for managing guest status changes with audit logging
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Define Status enum locally for now until types are updated
export type GuestStatus = 'REGISTERED' | 'PENDING' | 'CONFIRMED' | 'ATTENDED' | 'CANCELLED'

export type StatusChangeReason = 
  | 'invitation_accepted'
  | 'invitation_rejected' 
  | 'data_completed'
  | 'data_updated'
  | 'admin_action'
  | 'migration'
  | string // Allow custom reasons

/**
 * Change the status of a guest with automatic logging
 */
export async function changeGuestStatus(
  guestId: string,
  newStatus: GuestStatus,
  reason?: StatusChangeReason
): Promise<{ success: boolean; guest: any; statusLog: any }> {
  return await prisma.$transaction(async (tx: any) => {
    // Get current guest status
    const currentGuest = await tx.guest.findUnique({
      where: { id: guestId },
      select: { id: true, status: true, name: true }
    })
    
    if (!currentGuest) {
      throw new Error(`Guest with ID ${guestId} not found`)
    }
    
    // Don't create log if status is the same
    if (currentGuest.status === newStatus) {
      return {
        success: true,
        guest: currentGuest,
        statusLog: null
      }
    }
    
    // Update guest status
    const updatedGuest = await tx.guest.update({
      where: { id: guestId },
      data: { status: newStatus }
    })
    
    // Create status change log
    const statusLog = await tx.guestStatusLog.create({
      data: {
        guestId,
        fromStatus: currentGuest.status,
        toStatus: newStatus,
        reason: reason || `Status changed from ${currentGuest.status} to ${newStatus}`
      }
    })
    
    return {
      success: true,
      guest: updatedGuest,
      statusLog
    }
  })
}

/**
 * Change status for multiple guests by invite code
 */
export async function changeGuestStatusByInviteCode(
  inviteCode: string,
  newStatus: GuestStatus,
  reason?: StatusChangeReason
): Promise<{ success: boolean; updatedCount: number; guests: any[] }> {
  return await prisma.$transaction(async (tx: any) => {
    // Get all guests with this invite code
    const guests = await tx.guest.findMany({
      where: { inviteCode },
      select: { id: true, status: true, name: true }
    })
    
    if (guests.length === 0) {
      throw new Error(`No guests found with invite code: ${inviteCode}`)
    }
    
    const updatedGuests = []
    let updatedCount = 0
    
    // Update each guest
    for (const guest of guests) {
      if (guest.status !== newStatus) {
        // Update guest status
        const updatedGuest = await tx.guest.update({
          where: { id: guest.id },
          data: { status: newStatus }
        })
        
        // Create status log
        await tx.guestStatusLog.create({
          data: {
            guestId: guest.id,
            fromStatus: guest.status,
            toStatus: newStatus,
            reason: reason || `Bulk status change from ${guest.status} to ${newStatus}`
          }
        })
        
        updatedGuests.push(updatedGuest)
        updatedCount++
      } else {
        updatedGuests.push(guest)
      }
    }
    
    return {
      success: true,
      updatedCount,
      guests: updatedGuests
    }
  })
}

/**
 * Get status change history for a guest
 */
export async function getGuestStatusHistory(guestId: string) {
  const statusLogs = await (prisma as any).guestStatusLog.findMany({
    where: { guestId },
    orderBy: { changedAt: 'asc' },
    include: {
      guest: {
        select: { name: true, inviteCode: true }
      }
    }
  })
  
  return statusLogs
}

/**
 * Get status change history for all guests with an invite code
 */
export async function getInviteCodeStatusHistory(inviteCode: string) {
  const guests = await prisma.guest.findMany({
    where: { inviteCode },
    select: { id: true }
  })
  
  if (guests.length === 0) {
    return []
  }
  
  const guestIds = guests.map(g => g.id)
  
  const statusLogs = await (prisma as any).guestStatusLog.findMany({
    where: { 
      guestId: { in: guestIds }
    },
    orderBy: { changedAt: 'asc' },
    include: {
      guest: {
        select: { name: true, inviteCode: true }
      }
    }
  })
  
  return statusLogs
}

/**
 * Validate status transition
 */
export function isValidStatusTransition(fromStatus: GuestStatus, toStatus: GuestStatus): boolean {
  const validTransitions: Record<GuestStatus, GuestStatus[]> = {
    REGISTERED: ['PENDING', 'CANCELLED'],
    PENDING: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['ATTENDED', 'CANCELLED'],
    ATTENDED: [], // Final status
    CANCELLED: [] // Final status
  }
  
  return validTransitions[fromStatus]?.includes(toStatus) ?? false
}

/**
 * Change status with validation
 */
export async function changeGuestStatusWithValidation(
  guestId: string,
  newStatus: GuestStatus,
  reason?: StatusChangeReason
) {
  // Get current status first
  const currentGuest = await prisma.guest.findUnique({
    where: { id: guestId },
    select: { status: true }
  })
  
  if (!currentGuest) {
    throw new Error(`Guest with ID ${guestId} not found`)
  }
  
  // Validate transition
  if (!isValidStatusTransition(currentGuest.status as GuestStatus, newStatus)) {
    throw new Error(
      `Invalid status transition from ${currentGuest.status} to ${newStatus}`
    )
  }
  
  return changeGuestStatus(guestId, newStatus, reason)
}
