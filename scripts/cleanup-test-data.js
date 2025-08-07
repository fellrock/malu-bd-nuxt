#!/usr/bin/env node

/**
 * Script to clean up test data created by seed-status-test-data.js
 * Usage: node scripts/cleanup-test-data.js
 * 
 * This script removes all test guests created for status testing
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanupTestData() {
  console.log('🧹 Cleaning up test data...\n')
  
  try {
    // Delete guests with test reference codes
    const result = await prisma.guest.deleteMany({
      where: {
        OR: [
          { referenceCode: { startsWith: 'REG-' } },
          { referenceCode: { startsWith: 'CAN-' } },
          { referenceCode: { startsWith: 'PEN-' } },
          { referenceCode: { startsWith: 'CON-' } },
          { referenceCode: { startsWith: 'MIX-' } }
        ]
      }
    })
    
    console.log(`✅ Deleted ${result.count} test guests`)
    console.log('🎯 Test data cleanup completed!')
    
  } catch (error) {
    console.error('❌ Error cleaning up test data:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

cleanupTestData()
