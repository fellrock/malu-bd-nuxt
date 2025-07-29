import { PrismaClient } from '@prisma/client'

// Create a singleton Prisma client instance
declare global {
  var __prisma: PrismaClient | undefined
}

// Use global variable to prevent multiple Prisma client instances in development
export const prisma = globalThis.__prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma
}
