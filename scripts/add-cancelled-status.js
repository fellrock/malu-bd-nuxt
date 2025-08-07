#!/usr/bin/env node

/**
 * Add CANCELLED status to enum and migrate existing data
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addCancelledStatus() {
  try {
    console.log('🚀 Adding CANCELLED to Status enum...')
    
    // Add CANCELLED to the enum
    await prisma.$executeRaw`ALTER TYPE "Status" ADD VALUE 'CANCELLED';`
    
    console.log('✅ Successfully added CANCELLED to Status enum')
    
    // Now check for guests with cancelledAt and update them
    const cancelledGuests = await prisma.$queryRaw`
      SELECT id, name FROM "Guest" WHERE "cancelledAt" IS NOT NULL;
    `
    
    console.log(`📋 Found ${cancelledGuests.length} guests with cancelledAt set`)
    
    if (cancelledGuests.length > 0) {
      // Update them to CANCELLED status
      await prisma.$executeRaw`
        UPDATE "Guest" SET status = 'CANCELLED' WHERE "cancelledAt" IS NOT NULL;
      `
      
      console.log(`✅ Updated ${cancelledGuests.length} guests to CANCELLED status`)
    }
    
    console.log('🎉 Migration completed! Ready to apply new schema.')
    
  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

addCancelledStatus().catch(console.error)
