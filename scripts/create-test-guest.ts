#!/usr/bin/env node

/**
 * Create a test guest with REGISTERED status for testing the invitation flow
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createTestGuest() {
  try {
    console.log('🧪 Creating test guest with REGISTERED status...')
    
    // Generate unique name with timestamp
    const timestamp = Date.now()
    const testGuest = await prisma.guest.create({
      data: {
        name: `Test User ${timestamp}`,
        email: `test${timestamp}@example.com`,
        inviteCode: 'TEST01',
        status: 'REGISTERED',
        category: 'Amigos',
        referenceCode: 'TEST-REF',
        notes: 'Test guest for invitation flow'
      }
    })
    
    console.log('✅ Test guest created:', {
      id: testGuest.id,
      name: testGuest.name,
      inviteCode: testGuest.inviteCode,
      status: testGuest.status
    })
    
    // Also create a status log for this guest
    await (prisma as any).guestStatusLog.create({
      data: {
        guestId: testGuest.id,
        fromStatus: null,
        toStatus: 'REGISTERED',
        reason: 'Test guest creation'
      }
    })
    
    console.log('✅ Status log created for test guest')
    console.log('🧪 You can now test the invitation-response API with:')
    console.log(`   curl -X POST http://localhost:3000/api/invitation-response \\`)
    console.log(`        -H "Content-Type: application/json" \\`)
    console.log(`        -d '{"inviteCode": "TEST01", "action": "ACCEPT"}'`)
    
  } catch (error) {
    console.error('❌ Error creating test guest:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestGuest().catch(console.error)
