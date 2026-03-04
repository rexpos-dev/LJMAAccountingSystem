import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

// Replace mysql:// with mariadb:// for the mariadb driver
const connectionString = (process.env.DATABASE_URL || '').replace(/^mysql:\/\//, 'mariadb://')

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

let prismaInstance = globalForPrisma.prisma

// Aggressive refresh in dev mode if salesUser or bankAccount is missing
if (process.env.NODE_ENV !== 'production' && prismaInstance && (!(prismaInstance as any).salesUser || !(prismaInstance as any).bankAccount)) {
  console.log('🔄 [Prisma] models missing from cached instance. FORCING REFRESH...');
  prismaInstance = undefined
}

if (!prismaInstance) {
  const adapter = new PrismaMariaDb(connectionString)

  prismaInstance = new PrismaClient({
    adapter,
    log: [
      { level: 'query', emit: 'event' },
      { level: 'error', emit: 'stdout' },
      { level: 'warn', emit: 'stdout' },
    ],
  });

  (prismaInstance as any).$on('query', (e: any) => {
    console.log(`\x1b[36m[Prisma Query]\x1b[0m ${e.query}`);
    console.log(`\x1b[33m[Params]\x1b[0m ${e.params}`);
  });
}

if (typeof window === 'undefined') {
  const models = Object.keys(prismaInstance).filter(k => k[0] === k[0].toLowerCase() && !k.startsWith('_'));
  if (!(prismaInstance as any).salesUser || !(prismaInstance as any).bankAccount) {
    console.error('❌ [Prisma] ERROR: Some models are missing from the client!');
  } else {
    console.log('✅ [Prisma] models initialized properly.');
  }
}

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prismaInstance
}

export const prisma = prismaInstance
