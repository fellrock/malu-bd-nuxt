# API Specifications - Invitation Flow Redesign (Updated with PENDING Status)

## 🔌 New API Endpoints Overview

### Summary
This document outlines the API endpoints required for the invitation flow redesign with the new PENDING status. The flow now uses PENDING as an intermediary status for guests who have accepted the invitation but haven't completed their data submission.

### Status Flow:
```
REGISTERED → (accept) → PENDING → (complete data) → CONFIRMED
     ↓
  (reject) → CANCELLED
```

---

## 📡 Endpoint 1: Invitation Response

### `POST /api/invitation-response`

**Purpose:** Handle initial invitation acceptance (REGISTERED → PENDING) or rejection (REGISTERED → CANCELLED)

**Request Body:**
```typescript
interface InvitationResponseRequest {
  inviteCode: string           // 6-character invitation code
  action: 'ACCEPT' | 'REJECT'  // User's choice
  rejectionReason?: string     // Optional reason for rejection (only for REJECT)
}
```

**Response Body:**
```typescript
interface InvitationResponseSuccess {
  success: true
  message: string              // Success message
  referenceCode: string        // Group reference code
  action: 'ACCEPT' | 'REJECT'  // Confirmed action
  nextStep: 'complete_data' | 'thank_you' // Where to redirect user
  guestCount: number           // Number of guests affected
}

interface InvitationResponseError {
  success: false
  error: string                // Error message
  code: string                 // Error code for frontend handling
}
```

**Business Logic:**
```typescript
// For ACCEPT action:
1. Validate invitation code exists and guests have REGISTERED status
2. Update all associated guests to status 'PENDING'
3. Return success with redirect to convite page for data completion

// For REJECT action:
1. Validate invitation code exists and guests have REGISTERED status
2. Update all associated guests to status 'CANCELLED' 
3. Log rejection reason if provided in status change log
4. Return success with thank you message
```

**Example Requests:**

*Accept Invitation:*
```json
{
  "inviteCode": "FAMIL1",
  "action": "ACCEPT"
}
```

*Reject Invitation:*
```json
{
  "inviteCode": "FAMIL1",
  "action": "REJECT",
  "rejectionReason": "Conflito de agenda"
}
```

---

## 📡 Endpoint 2: Complete Invitation

### `POST /api/complete-invitation`

**Purpose:** Complete invitation process with guest data (PENDING → CONFIRMED)

**Request Body:**
```typescript
interface CompleteInvitationRequest {
  inviteCode: string           // 6-character invitation code
  guests: GuestData[]          // Complete guest data for all guests
}

interface GuestData {
  id?: string                  // Existing guest ID (for updates)
  name: string                 // Required: Guest full name
  email?: string               // Optional: Guest email
  dietary?: string             // Optional: Dietary restrictions
  kidAge?: number              // Optional: Child age (0-18)
  maleKid?: boolean            // Optional: Child gender (true=boy, false=girl)
  notes?: string               // Optional: Additional notes
}
```

**Response Body:**
```typescript
interface CompleteInvitationSuccess {
  success: true
  message: string              // Success message
  referenceCode: string        // Group reference code
  confirmedGuests: Guest[]     // Final confirmed guest data
  nextStep: 'event'            // Redirect to event page
}

interface CompleteInvitationError {
  success: false
  error: string                // Error message
  code: string                 // Error code
  validationErrors?: ValidationError[] // Field-specific errors
}

interface ValidationError {
  field: string                // Field name with error
  message: string              // Error message for field
}
```

**Business Logic:**
```typescript
1. Validate invitation code exists and has guests with PENDING status
2. Validate all guest data fields
3. Create or update guest records with provided data
4. Update all guests to status 'CONFIRMED'
5. Return success with redirect to event page
```

**Example Request:**
```json
{
  "inviteCode": "FAMIL1",
  "guests": [
    {
      "name": "Ana Silva",
      "email": "ana@email.com",
      "dietary": "Vegetariana"
    },
    {
      "name": "Pedro Silva", 
      "kidAge": 5,
      "maleKid": true,
      "dietary": "Alergia a amendoim"
    }
  ]
}
```

---

## 📡 Endpoint 3: Update Guest Data

### `POST /api/update-guest-data`

**Purpose:** Update guest information after confirmation (edit mode for CONFIRMED guests)

**Request Body:**
```typescript
interface UpdateGuestDataRequest {
  inviteCode: string           // 6-character invitation code
  guests: GuestUpdateData[]    // All guests for this invitation
}

interface GuestUpdateData {
  id: string                   // Required: Existing guest ID
  name: string                 // Required: Guest full name
  email?: string               // Optional: Guest email
  dietary?: string             // Optional: Dietary restrictions
  kidAge?: number              // Optional: Child age (0-18)
  maleKid?: boolean            // Optional: Child gender
  notes?: string               // Optional: Additional notes
  status?: 'CONFIRMED' | 'CANCELLED' // Optional: Status update
}
```

**Response Body:**
```typescript
interface UpdateGuestDataSuccess {
  success: true
  message: string              // Success message
  updatedGuests: Guest[]       // Updated guest data
  referenceCode: string        // Group reference code
}

interface UpdateGuestDataError {
  success: false
  error: string                // Error message
  code: string                 // Error code
  validationErrors?: ValidationError[] // Field-specific errors
}

interface ValidationError {
  field: string                // Field name with error
  message: string              // Error message for field
}
```

**HTTP Status Codes:**
- `200` - Success
- `400` - Invalid request data or validation errors
- `403` - Unauthorized (invitation not confirmed)
- `404` - Invalid invitation code or guest IDs
- `500` - Server error

**Business Logic:**
```typescript
1. Validate invitation code exists and has CONFIRMED guests only
2. Verify all guest IDs belong to this invitation
3. Validate all guest data fields
4. Update guest records in database (keep status as CONFIRMED)
5. Return updated guest information
```

**Example Request:**
```json
{
  "inviteCode": "FAMIL1",
  "guests": [
    {
      "id": "guest-123",
      "name": "Ana Silva Santos",
      "email": "ana.santos@email.com",
      "dietary": "Vegetariana estrita",
      "notes": "Chegará um pouco mais tarde"
    },
    {
      "id": "guest-124",
      "name": "Pedro Silva",
      "kidAge": 6,
      "maleKid": true,
      "dietary": "Alergia a amendoim e nozes"
    }
  ]
}
```

---

## 🗄️ Database Schema Considerations

### Updated Status Enum (Required):
```sql
enum Status {
  REGISTERED   -- Initial state when invitation is created
  PENDING      -- User accepted invitation but hasn't completed data
  CONFIRMED    -- Invitation accepted and all data provided
  REJECTED     -- Invitation explicitly rejected
  CANCELLED    -- Individual guest cancelled after confirmation  
  ATTENDED     -- Guest actually attended event
}
```

### Status Flow Logic:
```
REGISTERED → (accept invitation) → PENDING → (complete data) → CONFIRMED
     ↓
  (reject) → REJECTED

CONFIRMED → (edit data) → CONFIRMED (stays confirmed)
CONFIRMED → (cancel individual guest) → CANCELLED
```

### Migration Requirements:
```sql
-- Add new status values
ALTER TYPE "Status" ADD VALUE 'PENDING';
ALTER TYPE "Status" ADD VALUE 'REJECTED';

-- Update existing REGISTERED guests to appropriate status
-- (This might need manual review based on current data)
```

### New Fields (Optional):
Consider adding to Guest model:
```prisma
model Guest {
  // ... existing fields
  rejectionReason String?   // Why invitation was rejected
  rejectionDate   DateTime? // When rejection occurred
  acceptedDate    DateTime? // When invitation was accepted (PENDING status)
  confirmedDate   DateTime? // When data was completed (CONFIRMED status)
  updatedAt       DateTime  @updatedAt // Track data updates
}
```

---

## 🔒 Security Considerations

### Validation Rules:
1. **Invitation Code:** Must be exactly 6 alphanumeric characters
2. **Guest Names:** Min 1 character, max 100 characters, no special characters except spaces, hyphens, apostrophes
3. **Emails:** Valid email format when provided
4. **Kid Age:** 0-18 range when provided
5. **Text Fields:** Max length limits for dietary, notes, etc.

### Rate Limiting:
- Max 5 requests per minute per IP address
- Max 10 requests per hour per invitation code

### Error Handling:
- Never expose internal server details
- Use generic error messages for security
- Log detailed errors server-side for debugging

---

## 🧪 Testing Strategy

### Unit Tests:
- [ ] Validation schema testing
- [ ] Business logic testing  
- [ ] Error handling testing
- [ ] Database interaction testing

### Integration Tests:
- [ ] End-to-end API flow testing
- [ ] Database transaction testing
- [ ] Error scenario testing
- [ ] Rate limiting testing

### Test Cases:

**invitation-response endpoint:**
- [ ] Valid acceptance with guest data
- [ ] Valid rejection with reason
- [ ] Invalid invitation codes
- [ ] Already processed invitations
- [ ] Malformed request data
- [ ] Missing required fields

**update-guest-data endpoint:**
- [ ] Valid guest data updates
- [ ] Invalid guest IDs
- [ ] Unauthorized invitation codes
- [ ] Validation failures
- [ ] Partial update scenarios

**reject-invitation endpoint:**
- [ ] Valid rejection with feedback
- [ ] Valid rejection without feedback
- [ ] Already rejected invitations
- [ ] Invalid invitation codes

---

## 📊 Monitoring and Analytics

### Metrics to Track:
- Invitation acceptance rate
- Invitation rejection rate  
- Data update frequency
- API response times
- Error rates by endpoint
- Validation failure patterns

### Logging Requirements:
- All API calls with timestamps
- Validation failures with field details
- Error occurrences with stack traces
- Performance metrics

---

## 🚀 Implementation Order

### Priority 1: Core Functionality
1. Create `invitation-response.post.ts`
2. Create `update-guest-data.post.ts`
3. Basic validation and error handling

### Priority 2: Enhanced Features
1. Create `reject-invitation.post.ts`
2. Add comprehensive validation
3. Implement rate limiting

### Priority 3: Polish
1. Add detailed logging
2. Optimize performance
3. Add monitoring metrics

This specification provides a solid foundation for implementing the new invitation flow API endpoints with proper validation, error handling, and security considerations.
