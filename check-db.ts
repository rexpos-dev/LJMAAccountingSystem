const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Sales Count:', await prisma.posSale.count());
    console.log('Products Count:', await prisma.product.count());
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());

export { };
