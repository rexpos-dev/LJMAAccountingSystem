
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const count = await prisma.backupJob.count();
        console.log('BackupJob count:', count);
        const jobs = await prisma.backupJob.findMany({ take: 5 });
        console.log('BackupJobs:', jobs);
    } catch (e) {
        console.error('Error querying BackupJob:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
