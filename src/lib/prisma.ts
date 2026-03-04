import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

// Replace mysql:// with mariadb:// for the mariadb driver
const connectionString = (process.env.DATABASE_URL || '').replace(/^mysql:\/\//, 'mariadb://')

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

let prismaInstance = globalForPrisma.prisma

// Aggressive refresh in dev mode if salesUser is missing
if (process.env.NODE_ENV !== 'production' && prismaInstance && !(prismaInstance as any).salesUser) {
  console.log('🔄 [Prisma] SalesUser model missing from cached instance. FORCING REFRESH...');
  console.log('🔄 [Prisma] Notifications enabled.'); // Trigger reload
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
  if (!(prismaInstance as any).salesUser) {
    console.error('❌ [Prisma] ERROR: salesUser model is missing from the client!');
  } else {
    console.log('✅ [Prisma] salesUser model found.');
  }
}

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prismaInstance
}

export const prisma = prismaInstance
