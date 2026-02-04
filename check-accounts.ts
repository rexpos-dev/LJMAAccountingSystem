import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const accounts = await prisma.account.findMany({
        take: 5
    })
    console.log(JSON.stringify(accounts, null, 2))
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
