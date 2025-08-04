# Major Adjustments for Launch - Implementation Plan

## Overview
Restructure the app from individual guest management to group-based family management with 3 focused pages.

## Implementation Steps

### Phase 1: Database Schema Update ✅ NEXT
1. Update Prisma schema with new fields and enums
2. Remove unused fields (giftChoice, plusOnes)
3. Add new fields (category, referenceCode, kidAge, maleKid, cancelledAt)
4. Make email optional and name unique
5. Remove unique constraint from inviteCode
6. Run migration

### Phase 2: API Route Updates
1. Update existing API routes for group management
2. Modify `/api/guest-code/:code` to return all guests for inviteCode
3. Add new endpoints for group operations
4. Update validation schemas with Zod

### Phase 3: Admin Page (/admin)
1. Update dashboard to show referenceCode instead of individual names
2. Add category field to guest management
3. Implement spreadsheet import functionality
4. Implement spreadsheet export functionality
5. Update guest count logic for referenceCode grouping

### Phase 4: Invitation Page (/convite)
1. Create new invitation page replacing RSVP
2. Add route with inviteCode parameter (/convite/:code)
3. Implement group form for all guests under referenceCode
4. Add kid-specific fields with conditional display
5. Add reject button with confirmation dialog
6. Include event summary information

### Phase 5: Event Page (/evento)
1. Update event page with guest group information
2. Add individual guest management (update/cancel)
3. Add event timeline ("Cronograma do Evento")
4. Maintain existing cards (countdown, photos, location, dress, parking)
5. Add QR code for photo sharing

### Phase 6: Testing and Cleanup
1. Test all user flows
2. Update error handling
3. Verify mobile responsiveness
4. Update documentation

## Database Schema Changes

```prisma
enum Category {
  Amigos
  Creche
  Familia
  Padrinhos
}

model Guest {
  id            String    @id @default(cuid())
  name          String    @unique
  email         String?   // Optional but unique when provided
  inviteCode    String    // No longer unique
  status        Status    @default(REGISTERED)
  dietary       String?
  notes         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // New fields
  category      Category
  kidAge        Int?
  maleKid       Boolean?  @default(false)
  referenceCode String
  cancelledAt   DateTime?
  surveyRatingId Int?
}
```

## Priority Order
1. Database migration (blocking)
2. API routes (foundation)
3. Admin page updates
4. Invitation page creation
5. Event page updates
6. Testing and polish
