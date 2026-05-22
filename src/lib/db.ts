import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

// 1. Grab the correct pooled connection string from Vercel
// We use STORAGE_POSTGRES_URL for runtime queries to take advantage of the connection pooler
const rawUrl = process.env.STORAGE_POSTGRES_URL || process.env.STORAGE_POSTGRES_URL_NON_POOLING || process.env.DIRECT_URL || process.env.DATABASE_URL || '';

if (!rawUrl) {
  throw new Error("Missing database connection URL. Please set STORAGE_POSTGRES_URL or equivalent in your environment.");
}

// 2. Safely parse the URL and inject the SSL bypass parameters
// This fixes the "self-signed certificate" error
const connectionUrl = new URL(rawUrl);
connectionUrl.searchParams.set("uselibpqcompat", "true");
if (process.env.NODE_ENV === 'production') {
  connectionUrl.searchParams.set("sslmode", "require");
}

// 3. Configure the PostgreSQL connection pool with the updated string
const pool = new Pool({ 
  connectionString: connectionUrl.toString() 
})

// 4. Configure the Prisma Adapter
const adapter = new PrismaPg(pool)

// 5. Create a global variable to store the Prisma Client instance
// This prevents multiple instances during hot-reloading in development
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma