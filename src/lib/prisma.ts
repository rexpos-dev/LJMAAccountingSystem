import { PrismaClient } from '@/generated/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

const connectionString = process.env.DATABASE_URL!

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

let prismaInstance = globalForPrisma.prisma

// Aggressive refresh in dev mode if salesUser is missing
if (process.env.NODE_ENV !== 'production' && prismaInstance && !(prismaInstance as any).salesUser) {
  console.log('🔄 [Prisma] SalesUser model missing from cached instance. FORCING REFRESH...');
  prismaInstance = undefined
}

if (!prismaInstance) {
  prismaInstance = new PrismaClient({
    adapter: new PrismaMariaDb(connectionString),
    log: ['query', 'error', 'warn'],
  })
}

if (typeof window === 'undefined') {
  const models = Object.keys(prismaInstance).filter(k => k[0] === k[0].toLowerCase() && !k.startsWith('_'));
  console.log('🚀 [Prisma] models:', models);
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
