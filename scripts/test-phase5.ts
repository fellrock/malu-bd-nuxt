#!/usr/bin/env node

/**
 * Phase 5 Testing Script - Complete Invitation Flow
 * Tests the PENDING → CONFIRMED transition via convite page
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testPhase5Flow() {
  console.log('🧪 Testing Phase 5: Complete Invitation Flow')
  console.log('=' .repeat(50))
  
  try {
    // 1. Check current guest status
    console.log('1. Checking current guest status...')
    const currentGuest = await prisma.guest.findFirst({
      where: { inviteCode: 'TEST01' }
    })
    
    if (!currentGuest) {
      console.log('❌ No test guest found with code TEST01')
      return
    }
    
    console.log(`   Guest: ${currentGuest.name}`)
    console.log(`   Status: ${currentGuest.status}`)
    console.log(`   Email: ${currentGuest.email || 'Not set'}`)
    
    // 2. Test complete-invitation API
    console.log('\n2. Testing complete-invitation API...')
    
    const response = await fetch('http://localhost:3001/api/complete-invitation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inviteCode: 'TEST01',
        guests: [{
          id: currentGuest.id,
          name: 'Test User - Phase 5 Complete',
          email: 'phase5@test.com',
          dietary: 'No restrictions',
          notes: 'Phase 5 test completed successfully'
        }]
      })
    })
    
    if (response.ok) {
      const result = await response.json()
      console.log('   ✅ API Response:', result)
      
      if (result.success) {
        console.log(`   ✅ ${result.message}`)
        console.log(`   ✅ Guests updated: ${result.guestsUpdated}`)
        console.log(`   ✅ Redirect to: ${result.redirectTo}`)
      }
    } else {
      console.log('   ❌ API Error:', response.status, response.statusText)
      const errorText = await response.text()
      console.log('   Error details:', errorText)
    }
    
    // 3. Verify status change
    console.log('\n3. Verifying status change...')
    const updatedGuest = await prisma.guest.findFirst({
      where: { inviteCode: 'TEST01' }
    })
    
    if (updatedGuest) {
      console.log(`   Guest: ${updatedGuest.name}`)
      console.log(`   Status: ${updatedGuest.status}`)
      console.log(`   Email: ${updatedGuest.email}`)
      console.log(`   Dietary: ${updatedGuest.dietary}`)
      console.log(`   Notes: ${updatedGuest.notes}`)
      
      if (updatedGuest.status === 'CONFIRMED') {
        console.log('   ✅ Status successfully changed to CONFIRMED')
      } else {
        console.log('   ❌ Status not changed - still ' + updatedGuest.status)
      }
    }
    
    console.log('\n🎉 Phase 5 Testing Complete!')
    console.log('\nNext steps:')
    console.log('- Visit http://localhost:3001/TEST01 (should show "already confirmed")')
    console.log('- Visit http://localhost:3001/convite/TEST01 (should redirect to evento)')
    console.log('- Visit http://localhost:3001/evento/TEST01 (should show event page)')
    
  } catch (error) {
    console.error('❌ Test error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testPhase5Flow().catch(console.error)
