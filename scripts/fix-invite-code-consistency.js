#!/usr/bin/env node

/**
 * Script to fix invite code consistency for guests with the same referenceCode
 * Ensures all guests in the same family/group share the same invite code
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixInviteCodeConsistency() {
  try {
    console.log('🔧 Starting invite code consistency fix...')
    
    // Get all guests grouped by referenceCode
    const guests = await prisma.guest.findMany({
      orderBy: [
        { referenceCode: 'asc' },
        { createdAt: 'asc' }
      ]
    })
    
    // Group guests by referenceCode
    const groupedGuests = {}
    
    guests.forEach(guest => {
      if (!groupedGuests[guest.referenceCode]) {
        groupedGuests[guest.referenceCode] = []
      }
      groupedGuests[guest.referenceCode].push(guest)
    })
    
    let fixedGroups = 0
    let totalUpdated = 0
    
    // Process each group
    for (const [referenceCode, groupGuests] of Object.entries(groupedGuests)) {
      // Check if all guests in the group have the same invite code
      const inviteCodes = [...new Set(groupGuests.map(g => g.inviteCode))]
      
      if (inviteCodes.length > 1) {
        console.log(`📋 Found inconsistency in group "${referenceCode}":`)
        console.log(`   - ${groupGuests.length} guests with ${inviteCodes.length} different invite codes`)
        console.log(`   - Codes: ${inviteCodes.join(', ')}`)
        
        // Use the invite code of the first (oldest) guest in the group
        const correctInviteCode = groupGuests[0].inviteCode
        console.log(`   - Using invite code: ${correctInviteCode}`)
        
        // Update all other guests in the group to use the same invite code
        for (let i = 1; i < groupGuests.length; i++) {
          const guest = groupGuests[i]
          if (guest.inviteCode !== correctInviteCode) {
            await prisma.guest.update({
              where: { id: guest.id },
              data: { inviteCode: correctInviteCode }
            })
            console.log(`   ✅ Updated ${guest.name} (${guest.inviteCode} → ${correctInviteCode})`)
            totalUpdated++
          }
        }
        
        fixedGroups++
      } else {
        console.log(`✅ Group "${referenceCode}" is consistent (${groupGuests.length} guests, code: ${inviteCodes[0]})`)
      }
    }
    
    console.log(`\n🎉 Consistency fix completed!`)
    console.log(`   - Groups processed: ${Object.keys(groupedGuests).length}`)
    console.log(`   - Groups fixed: ${fixedGroups}`)
    console.log(`   - Guests updated: ${totalUpdated}`)
    
  } catch (error) {
    console.error('❌ Error fixing invite code consistency:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
fixInviteCodeConsistency()
  .then(() => {
    console.log('✨ Script completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Script failed:', error)
    process.exit(1)
  })
