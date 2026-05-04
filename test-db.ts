
import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import mariadb from 'mariadb'
import dotenv from 'dotenv'

dotenv.config()

const dbUrlRaw = process.env.DATABASE_URL || 'mariadb://root:@localhost:3306/ljma_accounting';
const dbUrl = new URL(dbUrlRaw.replace(/^mysql:\/\//, 'http://').replace(/^mariadb:\/\//, 'http://'));

const poolConfig: mariadb.PoolConfig = {
    host: dbUrl.hostname === 'localhost' ? '127.0.0.1' : dbUrl.hostname,
    port: parseInt(dbUrl.port, 10) || 3306,
    user: dbUrl.username || 'root',
    password: dbUrl.password ? decodeURIComponent(dbUrl.password) : '',
    database: dbUrl.pathname.replace('/', ''),
    connectionLimit: 10,
};

async function main() {
    const adapter = new PrismaMariaDb(poolConfig)
    const prisma = new PrismaClient({ adapter })

    try {
        console.log('Fetching suppliers...')
        const suppliers = await prisma.supplier.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' },
        })
        console.log('Suppliers count:', suppliers.length)
        if (suppliers.length > 0) {
            console.log('First supplier:', suppliers[0])
        }
    } catch (error) {
        console.error('Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
