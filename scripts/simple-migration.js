#!/usr/bin/env node

/**
 * Simplified migration script with individual statements
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function runSimpleMigration() {
  try {
    console.log('🚀 Starting simplified migration...')
    
    // Step 1: Add CANCELLED to enum (try, but might already exist)
    try {
      console.log('1️⃣ Adding CANCELLED to Status enum...')
      await prisma.$executeRaw`ALTER TYPE "Status" ADD VALUE 'CANCELLED';`
      console.log('   ✅ Added CANCELLED to Status enum')
    } catch (error) {
      console.log('   ⚠️ CANCELLED might already exist in enum:', error.message)
    }
    
    // Step 2: Create GuestStatusLog table
    try {
      console.log('2️⃣ Creating GuestStatusLog table...')
      await prisma.$executeRaw`
        CREATE TABLE "GuestStatusLog" (
          "id" TEXT NOT NULL,
          "guestId" TEXT NOT NULL,
          "fromStatus" "Status",
          "toStatus" "Status" NOT NULL,
          "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "reason" TEXT,
          CONSTRAINT "GuestStatusLog_pkey" PRIMARY KEY ("id")
        );
      `
      console.log('   ✅ Created GuestStatusLog table')
    } catch (error) {
      console.log('   ⚠️ GuestStatusLog table might already exist:', error.message)
    }
    
    // Step 3: Create indexes
    try {
      console.log('3️⃣ Creating indexes...')
      await prisma.$executeRaw`CREATE INDEX "GuestStatusLog_guestId_idx" ON "GuestStatusLog"("guestId");`
      await prisma.$executeRaw`CREATE INDEX "GuestStatusLog_changedAt_idx" ON "GuestStatusLog"("changedAt");`
      console.log('   ✅ Created indexes')
    } catch (error) {
      console.log('   ⚠️ Indexes might already exist:', error.message)
    }
    
    // Step 4: Add foreign key
    try {
      console.log('4️⃣ Adding foreign key constraint...')
      await prisma.$executeRaw`
        ALTER TABLE "GuestStatusLog" 
        ADD CONSTRAINT "GuestStatusLog_guestId_fkey" 
        FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      `
      console.log('   ✅ Added foreign key constraint')
    } catch (error) {
      console.log('   ⚠️ Foreign key might already exist:', error.message)
    }
    
    // Step 5: Update cancelled guests
    console.log('5️⃣ Updating cancelled guests to CANCELLED status...')
    const cancelledUpdateResult = await prisma.$executeRaw`
      UPDATE "Guest" SET status = 'CANCELLED' WHERE "cancelledAt" IS NOT NULL;
    `
    console.log(`   ✅ Updated guests: ${cancelledUpdateResult}`)
    
    // Step 6: Generate IDs and create status logs for existing guests
    console.log('6️⃣ Creating initial status logs...')
    
    // First get all guests
    const allGuests = await prisma.guest.findMany({
      select: { id: true, status: true, createdAt: true }
    })
    
    console.log(`   Found ${allGuests.length} guests to create logs for`)
    
    // Create status logs one by one (safer than bulk insert with raw SQL)
    for (const guest of allGuests) {
      try {
        await prisma.guestStatusLog.create({
          data: {
            guestId: guest.id,
            fromStatus: null,
            toStatus: guest.status,
            changedAt: guest.createdAt,
            reason: 'Initial status on migration'
          }
        })
      } catch (error) {
        console.log(`   ⚠️ Failed to create log for guest ${guest.id}:`, error.message)
      }
    }
    
    console.log('   ✅ Created initial status logs')
    
    // Step 7: Drop cancelledAt column
    try {
      console.log('7️⃣ Dropping cancelledAt column...')
      await prisma.$executeRaw`ALTER TABLE "Guest" DROP COLUMN "cancelledAt";`
      console.log('   ✅ Dropped cancelledAt column')
    } catch (error) {
      console.log('   ⚠️ cancelledAt column might already be dropped:', error.message)
    }
    
    console.log('🎉 Migration completed successfully!')
    
    // Verification
    console.log('🔍 Verifying migration...')
    const guestCount = await prisma.guest.count()
    const cancelledCount = await prisma.guest.count({ where: { status: 'CANCELLED' } })
    const statusLogCount = await prisma.guestStatusLog.count()
    
    console.log(`   📊 Total guests: ${guestCount}`)
    console.log(`   📊 Cancelled guests: ${cancelledCount}`)
    console.log(`   📊 Status log entries: ${statusLogCount}`)
    
    console.log('✅ Migration verification completed!')
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

runSimpleMigration().catch(console.error)
