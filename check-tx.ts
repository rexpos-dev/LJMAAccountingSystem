
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const txs = await prisma.transaction.findMany({
        orderBy: { id: 'desc' },
        take: 10
    });
    console.log(JSON.stringify(txs, null, 2));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
