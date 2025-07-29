# Technical Implementation Details

## Database Schema

```prisma
model Guest {
  id            String   @id @default(cuid())
  name          String
  email         String   @unique
  inviteCode    String   @unique @db.Char(6)
  status        Status   @default(REGISTERED)
  dietary       String?
  giftChoice    String?
  plusOnes      Int      @default(0)
  surveyRating  Int?
  notes         String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

enum Status {
  REGISTERED
  CONFIRMED
  ATTENDED
}
```

## API Endpoints

### RSVP Submission
```typescript
// POST /api/rsvp
interface RsvpRequest {
  name: string;
  email?: string;
  phone?: string;
  guests: number;
  dietary?: string;
  notes?: string;
}
```

### Admin Response Retrieval
```typescript
// GET /api/responses
// Only accessible from localhost
interface Response {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  guests: number;
  dietary?: string;
  notes?: string;
  createdAt: Date;
}
```

## Form Validation

```typescript
// Zod schema for RSVP form
const rsvpSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido").optional(),
  phone: z.string().optional(),
  guests: z.number().min(1).max(10),
  dietary: z.string().optional(),
  notes: z.string().optional()
});
```

## Components Structure

```
components/
├─ layout/
│  ├─ AppHeader.vue
│  └─ AppFooter.vue
├─ landing/
│  ├─ WelcomeSection.vue
│  ├─ CountdownTimer.vue
│  └─ LocationMap.vue
├─ rsvp/
│  ├─ RsvpForm.vue
│  └─ SuccessMessage.vue
└─ admin/
   └─ ResponseList.vue
```

## Pages Structure

```
pages/
├─ index.vue      // Landing page
├─ rsvp.vue       // RSVP form
├─ admin.vue      // Admin view (localhost only)
├─ gifts.vue      // Gift information
└─ photos.vue     // Photo sharing info
```
