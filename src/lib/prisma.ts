import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

let prismaInstance = globalForPrisma.prisma

if (!prismaInstance) {
  const dbUrl = process.env.DATABASE_URL || 'mysql://root:123700@localhost:3306/ljma_accounting';
  console.log(`🔌 [Prisma] Initializing with URL: ${dbUrl.replace(/:[^:@]+@/, ':****@')}`);
  
  const adapter = new PrismaMariaDb(dbUrl)

  prismaInstance = new PrismaClient({
    adapter,
    log: [
      { level: 'query', emit: 'event' },
      { level: 'error', emit: 'stdout' },
      { level: 'warn', emit: 'stdout' },
    ],
  });
}

if (typeof window === 'undefined') {
  console.log('✅ [Prisma] Client initialized.');
}

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prismaInstance
}

export const prisma = prismaInstance
