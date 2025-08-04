-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('REGISTERED', 'CONFIRMED', 'ATTENDED');

-- CreateEnum
CREATE TYPE "public"."Category" AS ENUM ('Amigos', 'Creche', 'Familia', 'Padrinhos');

-- CreateTable
CREATE TABLE "public"."Guest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "inviteCode" TEXT NOT NULL,
    "status" "public"."Status" NOT NULL DEFAULT 'REGISTERED',
    "dietary" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "category" "public"."Category" NOT NULL,
    "kidAge" INTEGER,
    "maleKid" BOOLEAN DEFAULT false,
    "referenceCode" TEXT NOT NULL,
    "cancelledAt" TIMESTAMP(3),
    "surveyRatingId" INTEGER,

    CONSTRAINT "Guest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Guest_name_key" ON "public"."Guest"("name");

-- CreateIndex
CREATE INDEX "Guest_inviteCode_idx" ON "public"."Guest"("inviteCode");

-- CreateIndex
CREATE INDEX "Guest_referenceCode_idx" ON "public"."Guest"("referenceCode");
