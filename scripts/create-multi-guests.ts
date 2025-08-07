#!/usr/bin/env node

/**
 * Create multiple test guests with the same invite code to test group transitions
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createMultipleTestGuests() {
  try {
    console.log('🧪 Creating multiple test guests with same invite code...')
    
    // Generate unique invite code
    const inviteCode = 'TEST02'
    const timestamp = Date.now()
    
    // Create multiple guests with same invite code
    const guests = [
      {
        name: `Adult Guest ${timestamp}`,
        email: `adult${timestamp}@example.com`,
        inviteCode: inviteCode,
        status: 'REGISTERED' as any,
        category: 'Amigos' as any,
        referenceCode: 'TEST-FAMILY',
        notes: 'Primary adult guest'
      },
      {
        name: `Child Guest ${timestamp}`,
        email: '',
        inviteCode: inviteCode,
        status: 'REGISTERED' as any,
        category: 'Amigos' as any,
        referenceCode: 'TEST-FAMILY',
        kidAge: 5,
        maleKid: true,
        notes: 'Child guest'
      },
      {
        name: `Spouse Guest ${timestamp}`,
        email: `spouse${timestamp}@example.com`,
        inviteCode: inviteCode,
        status: 'REGISTERED' as any,
        category: 'Amigos' as any,
        referenceCode: 'TEST-FAMILY',
        notes: 'Spouse guest'
      }
    ]
    
    console.log(`Creating ${guests.length} guests with invite code: ${inviteCode}`)
    
    for (const guestData of guests) {
      const guest = await prisma.guest.create({
        data: guestData
      })
      
      console.log(`✅ Created: ${guest.name} (ID: ${guest.id})`)
      
      // Create status log
      await (prisma as any).guestStatusLog.create({
        data: {
          guestId: guest.id,
          fromStatus: null,
          toStatus: 'REGISTERED',
          reason: 'Multi-guest test creation'
        }
      })
    }
    
    console.log('\n🎯 Test scenario created!')
    console.log('Now you can test the complete flow:')
    console.log(`1. Accept invitation: curl -X POST http://localhost:3000/api/invitation-response -H "Content-Type: application/json" -d '{"inviteCode": "${inviteCode}", "action": "ACCEPT"}'`)
    console.log(`2. Visit convite page: http://localhost:3000/convite/${inviteCode}`)
    console.log(`3. Complete all guest data and submit`)
    console.log(`4. All guests should transition to CONFIRMED together`)
    
  } catch (error) {
    console.error('❌ Error creating test guests:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createMultipleTestGuests().catch(console.error)
