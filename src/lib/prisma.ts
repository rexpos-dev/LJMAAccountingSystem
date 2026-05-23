import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

let prismaInstance = globalForPrisma.prisma

if (!prismaInstance) {
  let dbUrl = process.env.DATABASE_URL || 'mysql://root:123700@localhost:3306/ljma_accounting';
  
  // Force IPv4 to prevent Node 17+ from attempting to connect to ::1, which causes the connection to hang and timeout.
  // Also increase the pool connection limit to prevent exhaustion during concurrent API requests.
  const urlObj = new URL(dbUrl);
  if (urlObj.hostname === 'localhost') {
    urlObj.hostname = '127.0.0.1';
  }
  urlObj.searchParams.set('connectionLimit', '50');
  dbUrl = urlObj.toString();

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
