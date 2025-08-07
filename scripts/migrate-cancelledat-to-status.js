#!/usr/bin/env node

/**
 * Migration script to handle cancelledAt → CANCELLED status transition
 * This script should be run BEFORE applying the new Prisma schema
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function migrateCancelledAtToStatus() {
  console.log('🚀 Starting migration: cancelledAt → CANCELLED status')
  
  try {
    // Step 1: Check current state
    const allGuests = await prisma.guest.findMany({
      select: {
        id: true,
        name: true,
        status: true,
        cancelledAt: true
      }
    })
    
    console.log(`📊 Found ${allGuests.length} guests in database`)
    
    const cancelledGuests = allGuests.filter(guest => guest.cancelledAt !== null)
    console.log(`📋 Found ${cancelledGuests.length} guests with cancelledAt set`)
    
    if (cancelledGuests.length === 0) {
      console.log('✅ No guests with cancelledAt found, migration not needed')
      return
    }
    
    // Step 2: First, we need to manually add CANCELLED to the enum
    console.log('⚠️  MANUAL STEP REQUIRED:')
    console.log('   Before running this script, you need to manually add CANCELLED to the Status enum:')
    console.log('   ALTER TYPE "Status" ADD VALUE \'CANCELLED\';')
    console.log('')
    
    const readline = await import('readline')
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
    
    const answer = await new Promise(resolve => {
      rl.question('Have you added CANCELLED to the Status enum? (y/N): ', resolve)
    })
    rl.close()
    
    if (answer.toLowerCase() !== 'y') {
      console.log('❌ Migration cancelled. Please add CANCELLED to Status enum first.')
      return
    }
    
    // Step 3: Update cancelled guests to CANCELLED status
    console.log(`🔄 Updating ${cancelledGuests.length} guests to CANCELLED status...`)
    
    for (const guest of cancelledGuests) {
      await prisma.guest.update({
        where: { id: guest.id },
        data: { status: 'CANCELLED' }
      })
      console.log(`  ✅ Updated ${guest.name} to CANCELLED status`)
    }
    
    console.log('✅ Migration completed successfully!')
    console.log('📝 Next steps:')
    console.log('   1. Apply the new Prisma schema (removes cancelledAt, adds GuestStatusLog)')
    console.log('   2. Run the backfill script to create initial status logs')
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateCancelledAtToStatus().catch(console.error)
}

export { migrateCancelledAtToStatus }
