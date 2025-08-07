-- Migration: Add CANCELLED status and GuestStatusLog table
-- This handles existing data safely

-- Step 1: Add CANCELLED to Status enum (only if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'CANCELLED' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'Status')) THEN
        ALTER TYPE "Status" ADD VALUE 'CANCELLED';
    END IF;
END $$;

-- Step 2: Create GuestStatusLog table
CREATE TABLE IF NOT EXISTS "GuestStatusLog" (
    "id" TEXT NOT NULL,
    "guestId" TEXT NOT NULL,
    "fromStatus" "Status",
    "toStatus" "Status" NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT,

    CONSTRAINT "GuestStatusLog_pkey" PRIMARY KEY ("id")
);

-- Step 3: Create indexes
CREATE INDEX IF NOT EXISTS "GuestStatusLog_guestId_idx" ON "GuestStatusLog"("guestId");
CREATE INDEX IF NOT EXISTS "GuestStatusLog_changedAt_idx" ON "GuestStatusLog"("changedAt");

-- Step 4: Add foreign key constraint
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'GuestStatusLog_guestId_fkey'
    ) THEN
        ALTER TABLE "GuestStatusLog" ADD CONSTRAINT "GuestStatusLog_guestId_fkey" 
        FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- Step 5: Update cancelled guests to CANCELLED status
UPDATE "Guest" SET status = 'CANCELLED' WHERE "cancelledAt" IS NOT NULL;

-- Step 6: Create initial status logs for all existing guests
INSERT INTO "GuestStatusLog" ("id", "guestId", "fromStatus", "toStatus", "changedAt", "reason")
SELECT 
    gen_random_uuid()::text,
    "id",
    NULL,
    "status",
    "createdAt",
    'Initial status on migration'
FROM "Guest"
ON CONFLICT DO NOTHING;

-- Step 7: Drop cancelledAt column
ALTER TABLE "Guest" DROP COLUMN IF EXISTS "cancelledAt";
