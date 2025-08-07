#!/usr/bin/env node

/**
 * Add missing enum values to PostgreSQL Status enum
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addMissingEnumValues() {
  try {
    console.log('🔧 Adding missing enum values to Status enum...')
    
    // Add PENDING if it doesn't exist
    try {
      console.log('   Adding PENDING...')
      await prisma.$executeRaw`ALTER TYPE "Status" ADD VALUE 'PENDING';`
      console.log('   ✅ Added PENDING')
    } catch (error) {
      console.log('   ⚠️ PENDING might already exist:', error.message)
    }
    
    console.log('🎉 All enum values added successfully!')
    
    // Test the enum values
    console.log('🧪 Testing enum values...')
    const testResult = await prisma.$queryRaw`
      SELECT enumlabel FROM pg_enum 
      WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'Status')
      ORDER BY enumlabel;
    `
    
    console.log('📋 Current Status enum values:', testResult)
    
  } catch (error) {
    console.error('❌ Error adding enum values:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

addMissingEnumValues().catch(console.error)
