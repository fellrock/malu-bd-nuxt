# Invitation Flow Redesign - Implementation Plan

## 🎯 Overview
Redesign the invitation flow to provide a cleaner, more intuitive user experience with better data validation and confirmation steps.

## 📋 Current State Analysis

### Current Flow:
1. `[code].vue` → Redirects to either `/convite/[code]` or `/evento/[code]`
2. `/convite/[code].vue` → Form for RSVP submission (immediate API calls)
3. `/evento/[code].vue` → Event info + guest management (immediate API calls)

### New Flow Requirements:
1. `[code].vue` → **NEW**: Initial invitation page with event info + accept/reject buttons
2. `/convite/[code].vue` → **MODIFIED**: Data collection form (no immediate API calls)
3. `/evento/[code].vue` → **MODIFIED**: Event info + guest editing (no immediate API calls)

## 🔄 New User Flow (Updated with PENDING Status)

### Status-Based Flow:
```
REGISTERED → (accept) → PENDING → (complete data) → CONFIRMED
     ↓
  (reject) → CANCELLED
```

### Phase 1: Initial Invitation Page (`[code].vue`)
**Current:** Simple redirect middleware
**New:** Full invitation landing page with status-aware routing

**Features:**
- Display event summary (date, time, location, parking)
- Show accept/reject buttons for REGISTERED guests
- **Accept:** Update status to PENDING + navigate to `/convite/[code]` for data entry
- **Reject:** Update status to CANCELLED + show thank you modal
- **Auto-redirect logic:**
  - PENDING guests → `/convite/[code]` (complete data)
  - CONFIRMED guests → `/evento/[code]` (view event info)
  - CANCELLED guests → Show rejection acknowledgment

### Phase 2: Data Collection Page (`/convite/[code].vue`)
**Current:** Form with immediate API submission
**New:** Draft mode with final confirmation for PENDING guests

**Features:**
- Only accessible by PENDING guests (middleware validation)
- All guest data entry (same fields as current)
- Local state management (no immediate API calls)
- "Enviar Dados" button for final submission (PENDING → CONFIRMED)
- Confirmation modal before API call

### Phase 3: Event Information Page (`/evento/[code].vue`)
**Current:** Display + edit with immediate API calls
**New:** Display mode with explicit edit mode for CONFIRMED guests

**Features:**
- Only accessible by CONFIRMED guests
- Event information display
- Guest data editing (local state only)
- "Salvar Alterações" button for final submission
- Confirmation modal before API call

## 📂 Implementation Tasks

### Task 1: Create New API Endpoints
**Files to modify/create:**
- `server/api/invitation-response.post.ts` (NEW)
- `server/api/complete-invitation.post.ts` (NEW)
- `server/api/update-guest-data.post.ts` (NEW)

**Endpoint Details:**
```typescript
// server/api/invitation-response.post.ts
POST /api/invitation-response
{
  inviteCode: string
  action: 'ACCEPT' | 'REJECT'
  rejectionReason?: string // Only for REJECT
}
// Response: ACCEPT → status to PENDING, REJECT → status to CANCELLED

// server/api/complete-invitation.post.ts  
POST /api/complete-invitation
{
  inviteCode: string
  guests: Array<GuestData>
}
// Changes status from PENDING → CONFIRMED with complete data

// server/api/update-guest-data.post.ts
POST /api/update-guest-data
{
  inviteCode: string
  guests: Array<GuestData>
}
// Updates data for CONFIRMED guests (keeps CONFIRMED status)
```

### Task 2: Redesign Initial Invitation Page (`[code].vue`)
**Current:** Simple redirect logic
**New:** Full invitation page

**Template Structure:**
```vue
<template>
  <div class="invitation-landing">
    <!-- Header -->
    <div class="header">
      <h1>Convite para a Festa da Maria Luiza! 🎉</h1>
      <p>Você foi convidado(a) para nossa celebração especial</p>
    </div>
    
    <!-- Event Summary (reuse from convite page) -->
    <div class="event-summary">
      <!-- Calendar, location, parking info -->
    </div>
    
    <!-- Invitation Actions -->
    <div class="invitation-actions">
      <button @click="acceptInvitation" class="accept-btn">
        <CheckIcon /> Aceitar Convite
      </button>
      <button @click="showRejectModal = true" class="reject-btn">
        <XMarkIcon /> Recusar Convite
      </button>
    </div>
    
    <!-- Reject Thank You Modal -->
    <div v-if="showRejectModal" class="modal-overlay">
      <!-- Thank you message + confirmation -->
    </div>
  </div>
</template>
```

**Middleware Changes:**
- Remove automatic redirection based on status
- Check guest status and show appropriate page content
- Handle different statuses:
  - REGISTERED: Show invitation landing page
  - PENDING: Auto-redirect to convite page
  - CONFIRMED: Auto-redirect to event page  
  - REJECTED: Show rejection acknowledgment

### Task 3: Modify Data Collection Page (`/convite/[code].vue`)
**Current:** Immediate API submission
**New:** Draft mode with confirmation for PENDING guests

**Key Changes:**
1. **Remove immediate API calls** from form submission
2. **Add local state management** for draft data
3. **Add confirmation flow** before final submission
4. **Update button text** from "Confirmar Presença" to "Enviar Dados"
5. **Add middleware validation** to ensure only PENDING guests can access

**Implementation Steps:**
```typescript
// Add draft state management
const draftGuests = ref<any[]>([])
const hasUnsavedChanges = ref(false)

// Modified submit function
async function submitForm() {
  // Validate locally first
  if (!validateForm()) return
  
  // Show confirmation modal
  showConfirmationModal.value = true
}

// New final submission function (PENDING → CONFIRMED)
async function confirmSubmission() {
  try {
    await $fetch('/api/complete-invitation', {
      method: 'POST',
      body: {
        inviteCode: inviteCode.value,
        guests: draftGuests.value
      }
    })
    
    // Show success and redirect to event page
    showSuccessModal.value = true
  } catch (error) {
    // Handle error
  }
}
```

### Task 4: Modify Event Information Page (`/evento/[code].vue`)
**Current:** Immediate API calls for edits
**New:** Draft mode with save confirmation

**Key Changes:**
1. **Add edit mode toggle** for guest data
2. **Local state management** for unsaved changes
3. **"Salvar Alterações" button** for final submission
4. **Unsaved changes warning** when navigating away

**Implementation Steps:**
```typescript
// Add edit state management
const editMode = ref(false)
const originalGuestData = ref<any[]>([])
const editedGuestData = ref<any[]>([])
const hasUnsavedChanges = computed(() => 
  JSON.stringify(originalGuestData.value) !== JSON.stringify(editedGuestData.value)
)

// Edit mode functions
function enterEditMode() {
  editMode.value = true
  editedGuestData.value = JSON.parse(JSON.stringify(originalGuestData.value))
}

function cancelEditMode() {
  editMode.value = false
  editedGuestData.value = JSON.parse(JSON.stringify(originalGuestData.value))
}

async function saveChanges() {
  try {
    await $fetch('/api/update-guest-data', {
      method: 'POST',
      body: {
        inviteCode: inviteCode.value,
        guests: editedGuestData.value
      }
    })
    
    // Update original data and exit edit mode
    originalGuestData.value = [...editedGuestData.value]
    editMode.value = false
    
    // Show success message
  } catch (error) {
    // Handle error
  }
}
```

### Task 5: Update Middleware and Routing
**Files to modify:**
- `app/pages/[code].vue` (major changes)
- `app/pages/convite/[code].vue` (update middleware)
- `app/pages/evento/[code].vue` (update middleware)

**New Routing Logic:**
```typescript
// [code].vue middleware (UPDATED with status-based routing)
definePageMeta({
  middleware: async (to) => {
    const inviteCode = to.params.code as string
    
    // Validate invite code exists
    const res = await $fetch(`/api/guest-code/${inviteCode}`)
    
    if (!res.success) {
      return navigateTo('/acesso-negado', { replace: true })
    }
    
    // Route based on guest status
    const guestStatus = res.guests[0]?.status
    
    switch (guestStatus) {
      case 'PENDING':
        return navigateTo(`/convite/${inviteCode}`, { replace: true })
      case 'CONFIRMED':
        return navigateTo(`/evento/${inviteCode}`, { replace: true })
      case 'REJECTED':
            } else if (guestStatus === 'CANCELLED') {
        // Stay on page but show rejection acknowledgment
        break
        break
      case 'REGISTERED':
      default:
        // Stay on page to show invitation landing
        break
    }
  }
})

// convite/[code].vue middleware (UPDATED for PENDING access only)
definePageMeta({
  middleware: async (to) => {
    const inviteCode = to.params.code as string
    const res = await $fetch(`/api/guest-code/${inviteCode}`)
    
    if (!res.success) {
      return navigateTo('/acesso-negado', { replace: true })
    }
    
    const guestStatus = res.guests[0]?.status
    
    // Only allow PENDING guests to access this page
    if (guestStatus === 'CONFIRMED') {
      return navigateTo(`/evento/${inviteCode}`, { replace: true })
    } else if (guestStatus === 'REGISTERED') {
      return navigateTo(`/${inviteCode}`, { replace: true })
    } else if (guestStatus === 'CANCELLED') {
      return navigateTo('/acesso-negado', { replace: true })
    }
    // PENDING guests can proceed
  }
})

// evento/[code].vue middleware (UPDATED for CONFIRMED access only)
definePageMeta({
  middleware: async (to) => {
    const inviteCode = to.params.code as string
    const res = await $fetch(`/api/guest-code/${inviteCode}`)
    
    if (!res.success) {
      return navigateTo('/acesso-negado', { replace: true })
    }
    
    const guestStatus = res.guests[0]?.status
    
    // Only allow CONFIRMED guests to access this page
    if (guestStatus === 'PENDING') {
      return navigateTo(`/convite/${inviteCode}`, { replace: true })
    } else if (guestStatus === 'REGISTERED') {
      return navigateTo(`/${inviteCode}`, { replace: true })
    } else if (guestStatus === 'CANCELLED') {
      return navigateTo('/acesso-negado', { replace: true })
    }
    // CONFIRMED guests can proceed
  }
})
```

### Task 6: Create Shared Components
**New components to create:**
- `components/EventSummary.vue` (shared event info display)
- `components/GuestForm.vue` (reusable guest data form)
- `components/ConfirmationModal.vue` (reusable confirmation modal)

### Task 7: Update Styling and UX
**Files to modify:**
- `assets/css/main.css` (add new styles)
- Update responsive design for new layout
- Add loading states for async operations
- Add form validation feedback

## 🔄 Database Changes

### New Status Values (Updated)
**Status Values:**
- `REGISTERED` - Initial state when invitation is sent
- `PENDING` - When user accepts but hasn't provided full data  
- `CONFIRMED` - When all data is provided and confirmed
- `ATTENDED` - When guest actually attends event
- `CANCELLED` - When invitation is explicitly rejected (replaces cancelledAt)

**Migration Requirements:**
1. **Add CANCELLED status** to Status enum
2. **Remove cancelledAt field** from Guest table  
3. **Add GuestStatusLog table** for status change audit trail
4. **Update existing queries** to check status = 'CANCELLED' instead of cancelledAt IS NOT NULL
5. **Backfill status logs** for existing guests with initial REGISTERED status

**GuestStatusLog Table:**
```prisma
model GuestStatusLog {
  id          String   @id @default(cuid())
  guestId     String
  fromStatus  Status?  // null for initial status
  toStatus    Status
  changedAt   DateTime @default(now())
  reason      String?  // Optional reason for status change
  
  // Relations
  guest       Guest    @relation(fields: [guestId], references: [id], onDelete: Cascade)
  
  @@index([guestId])
  @@index([changedAt])
}
```

## 🧪 Testing Strategy

### Test Scenarios:
1. **Fresh invitation** → Accept → Data entry → Confirmation
2. **Fresh invitation** → Reject → Thank you modal
3. **Partial data** → Resume → Complete submission
4. **Already confirmed** → Edit mode → Save changes
5. **Navigation with unsaved changes** → Warning modal
6. **API error handling** → User feedback
7. **Form validation** → Error states

## 📱 Mobile Considerations

### Mobile-Specific UX:
- Ensure event summary is readable on small screens
- Make buttons appropriately sized for touch
- Consider swipe gestures for guest editing
- Optimize form layouts for mobile keyboards

## 🚀 Deployment Strategy

### Phase 1: API Endpoints
1. Create new API endpoints
2. Test with existing frontend
3. Deploy to staging

### Phase 2: Frontend Updates
1. Update `[code].vue` page
2. Modify existing pages
3. Test complete flow
4. Deploy to staging

### Phase 3: Full Release
1. Final testing on staging
2. Deploy to production
3. Monitor user behavior
4. Gather feedback

## ⚠️ Risk Mitigation

### Potential Issues:
1. **Data loss** during draft mode → Auto-save to localStorage
2. **User confusion** with new flow → Clear UX and instructions
3. **API failures** during submission → Retry logic and error handling
4. **Mobile compatibility** → Extensive mobile testing

### Rollback Plan:
- Keep current API endpoints functional
- Feature flag new flow for gradual rollout
- Quick rollback to previous version if needed

## 📊 Success Metrics

### KPIs to Track:
- Invitation acceptance rate
- Form completion rate
- Time to complete RSVP
- Error rate reduction
- User satisfaction feedback

---

## 🎯 Implementation Priority

### High Priority:
1. Create new API endpoints
2. Update `[code].vue` initial page
3. Basic draft mode in convite page

### Medium Priority:
1. Edit mode in event page
2. Shared components
3. Enhanced UX features

### Low Priority:
1. Advanced features (auto-save, etc.)
2. Analytics integration
3. Performance optimizations

This plan provides a comprehensive roadmap for implementing the new invitation flow while maintaining system stability and user experience quality.

## 🗃️ Migration Strategy for cancelledAt → CANCELLED Status

### Files to Update:

1. **server/api/guests.get.ts** - Replace `cancelledAt: null` with `status: { not: 'CANCELLED' }`
2. **server/api/cancel-guests.post.ts** - Replace `cancelledAt: new Date()` with `status: 'CANCELLED'`
3. **server/api/export-guests.get.ts** - Replace `cancelledAt: null` with `status: { not: 'CANCELLED' }`
4. **server/api/guest-code/[code].get.ts** - Replace `cancelledAt: null` with `status: { not: 'CANCELLED' }`

### Migration SQL:
```sql
-- Step 1: Add CANCELLED to Status enum
ALTER TYPE "Status" ADD VALUE 'CANCELLED';

-- Step 2: Update existing cancelled guests
UPDATE "Guest" SET status = 'CANCELLED' WHERE "cancelledAt" IS NOT NULL;

-- Step 3: Create GuestStatusLog table
-- (This will be handled by Prisma migration)

-- Step 4: Backfill status logs for existing guests  
INSERT INTO "GuestStatusLog" ("guestId", "fromStatus", "toStatus", "changedAt", "reason")
SELECT 
  id,
  NULL,
  status,
  "createdAt",
  'Initial status on migration'
FROM "Guest";

-- Step 5: Drop cancelledAt column
ALTER TABLE "Guest" DROP COLUMN "cancelledAt";
```

### Status Change Service Layer:
```typescript
// server/utils/guest-status.ts
import { PrismaClient, Status } from '@prisma/client'

const prisma = new PrismaClient()

export async function changeGuestStatus(
  guestId: string,
  newStatus: Status,
  reason?: string
) {
  return await prisma.$transaction(async (tx) => {
    // Get current status
    const currentGuest = await tx.guest.findUnique({
      where: { id: guestId },
      select: { status: true }
    })
    
    if (!currentGuest) {
      throw new Error('Guest not found')
    }
    
    // Update guest status
    const updatedGuest = await tx.guest.update({
      where: { id: guestId },
      data: { status: newStatus }
    })
    
    // Log status change
    await tx.guestStatusLog.create({
      data: {
        guestId,
        fromStatus: currentGuest.status,
        toStatus: newStatus,
        reason
      }
    })
    
    return updatedGuest
  })
}
```
