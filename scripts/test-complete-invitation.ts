#!/usr/bin/env node

/**
 * Test the complete-invitation API with multiple guests
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testCompleteInvitation() {
  try {
    console.log('🧪 Testing complete-invitation with multiple guests...')
    
    // Get all PENDING guests for TEST02
    const pendingGuests = await prisma.guest.findMany({
      where: { 
        inviteCode: 'TEST02',
        status: 'PENDING' as any
      }
    })
    
    console.log(`Found ${pendingGuests.length} PENDING guests:`)
    pendingGuests.forEach(guest => {
      console.log(`- ${guest.name} (ID: ${guest.id})`)
    })
    
    if (pendingGuests.length === 0) {
      console.log('❌ No PENDING guests found. Make sure to accept the invitation first.')
      return
    }
    
    // Prepare the payload with all guests
    const guestPayload = pendingGuests.map(guest => ({
      id: guest.id,
      name: guest.name + ' - Updated',
      email: guest.email || `${guest.id}@example.com`,
      dietary: 'No restrictions',
      notes: 'Updated via API test'
    }))
    
    console.log('\n📤 Sending complete-invitation request...')
    
    const response = await fetch('http://localhost:3000/api/complete-invitation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inviteCode: 'TEST02',
        guests: guestPayload
      })
    })
    
    if (response.ok) {
      const result = await response.json()
      console.log('✅ Success!')
      console.log('Response:', result)
    } else {
      console.log('❌ Error:', response.status, response.statusText)
      const errorText = await response.text()
      console.log('Error details:', errorText)
    }
    
    // Check final status
    console.log('\n🔍 Checking final guest statuses...')
    const finalGuests = await prisma.guest.findMany({
      where: { inviteCode: 'TEST02' }
    })
    
    finalGuests.forEach(guest => {
      console.log(`- ${guest.name}: ${guest.status}`)
    })
    
  } catch (error) {
    console.error('❌ Test error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testCompleteInvitation().catch(console.error)
