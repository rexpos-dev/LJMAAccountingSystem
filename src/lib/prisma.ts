import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import mariadb from 'mariadb'

// Parse the DATABASE_URL to properly configure the pool object manually
const dbUrlRaw = process.env.DATABASE_URL || 'mariadb://root:@localhost:3306/ljma_accounting';
const dbUrl = new URL(dbUrlRaw.replace(/^mysql:\/\//, 'http://').replace(/^mariadb:\/\//, 'http://'));

const poolConfig: mariadb.PoolConfig = {
  host: dbUrl.hostname === 'localhost' ? '127.0.0.1' : dbUrl.hostname,
  port: parseInt(dbUrl.port, 10) || 3306,
  user: dbUrl.username || 'root',
  password: dbUrl.password ? decodeURIComponent(dbUrl.password) : '',
  database: dbUrl.pathname.replace('/', ''),
  connectionLimit: 100,
};

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  _adapterVersion3?: boolean
}

let prismaInstance = globalForPrisma.prisma

// Force a one-time clean slate for the connection pool
if (!globalForPrisma._adapterVersion3) {
  console.log('🔄 [Prisma] Forcing a clean reload of connection pool & prisma client...');
  if (prismaInstance) {
    try { prismaInstance.$disconnect(); } catch (e) { }
  }
  prismaInstance = undefined;
  globalForPrisma.prisma = undefined;
  globalForPrisma._adapterVersion3 = true;
}

// Aggressive refresh in dev mode if models are missing
if (process.env.NODE_ENV !== 'production' && prismaInstance && (!(prismaInstance as any).salesUser || !(prismaInstance as any).bankAccount || !(prismaInstance as any).employee)) {
  console.log('🔄 [Prisma] models missing from cached instance. FORCING REFRESH...');
  try { prismaInstance.$disconnect(); } catch (e) { }
  prismaInstance = undefined
  globalForPrisma.prisma = undefined;
}

if (!prismaInstance) {
  const adapter = new PrismaMariaDb(poolConfig)

  prismaInstance = new PrismaClient({
    adapter,
    log: [
      { level: 'query', emit: 'event' },
      { level: 'error', emit: 'stdout' },
      { level: 'warn', emit: 'stdout' },
    ],
  });

  (prismaInstance as any).$on('query', (e: any) => {
    // console.log(`\x1b[36m[Prisma Query]\x1b[0m ${e.query}`);
  });
}

if (typeof window === 'undefined') {
  if (!(prismaInstance as any).salesUser || !(prismaInstance as any).bankAccount || !(prismaInstance as any).employee) {
    console.error('❌ [Prisma] ERROR: Some models are missing from the client!');
  } else {
    console.log('✅ [Prisma] models initialized properly.');
  }
}

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prismaInstance
}

export const prisma = prismaInstance
