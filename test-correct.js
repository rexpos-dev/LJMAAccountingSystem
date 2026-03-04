const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    }
});
async function main() {
    console.log("Connecting to DB...");
    const user = await prisma.userPermission.findFirst();
    console.log("Found user:", user?.username);
    await prisma.$disconnect();
}
main().catch(console.error);
