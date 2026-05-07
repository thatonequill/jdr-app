import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const connectionString = `${process.env.DATABASE_URL}`

// 1. Configure the PostgreSQL connection pool
// This uses your 'DATABASE_URL' from.env (Port 6543)
const pool = new Pool({ connectionString })

// 2. Configure the Prisma Adapter
const adapter = new PrismaPg(pool)

// 3. Create a global variable to store the Prisma Client instance
// This prevents multiple instances during hot-reloading in development
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter })

if (process.env.NODE_ENV!== 'production') globalForPrisma.prisma = prisma