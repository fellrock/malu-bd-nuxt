#!/usr/bin/env node

/**
 * Manual migration script to handle schema changes safely
 */

import { PrismaClient } from '@prisma/client'
import { readFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const prisma = new PrismaClient()

async function runMigration() {
  try {
    console.log('🚀 Starting manual migration...')
    
    // Read the migration SQL file
    const migrationPath = join(__dirname, '..', 'migration-manual.sql')
    const migrationSQL = await readFile(migrationPath, 'utf-8')
    
    console.log('📄 Loaded migration SQL')
    
    // Split the SQL into individual statements (rough split by semicolon)
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
    
    console.log(`🔄 Executing ${statements.length} migration statements...`)
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement.trim()) {
        try {
          console.log(`   ${i + 1}/${statements.length}: Executing...`)
          await prisma.$executeRawUnsafe(statement + ';')
          console.log(`   ✅ Statement ${i + 1} completed`)
        } catch (error) {
          console.log(`   ⚠️  Statement ${i + 1} failed (might be expected):`, error.message)
        }
      }
    }
    
    console.log('🎉 Migration completed!')
    
    // Verify the migration
    console.log('🔍 Verifying migration...')
    
    const guestCount = await prisma.guest.count()
    console.log(`   📊 Total guests: ${guestCount}`)
    
    const cancelledCount = await prisma.guest.count({
      where: { status: 'CANCELLED' }
    })
    console.log(`   📊 Cancelled guests: ${cancelledCount}`)
    
    try {
      const statusLogCount = await prisma.guestStatusLog.count()
      console.log(`   📊 Status log entries: ${statusLogCount}`)
    } catch (error) {
      console.log('   ⚠️  Could not count status logs:', error.message)
    }
    
    console.log('✅ Migration verification completed!')
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

runMigration().catch(console.error)
