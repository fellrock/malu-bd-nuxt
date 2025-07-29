-- CreateEnum
CREATE TYPE "Status" AS ENUM ('REGISTERED', 'CONFIRMED', 'ATTENDED');

-- CreateTable
CREATE TABLE "Guest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "inviteCode" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'REGISTERED',
    "dietary" TEXT,
    "giftChoice" TEXT,
    "plusOnes" INTEGER NOT NULL DEFAULT 0,
    "surveyRating" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Guest_email_key" ON "Guest"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Guest_inviteCode_key" ON "Guest"("inviteCode");

