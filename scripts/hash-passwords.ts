/**
 * One-time migration script: hash all plaintext passwords in the DB.
 * Run with: npx tsx scripts/hash-passwords.ts
 *
 * Safe to run multiple times — already-hashed passwords are skipped.
 */
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.userPermission.findMany();
    let migrated = 0;
    let skipped = 0;

    for (const user of users) {
        if (!user.password || user.password.startsWith('$2')) {
            skipped++;
            continue;
        }

        const hashed = await bcrypt.hash(user.password, 12);
        await prisma.userPermission.update({
            where: { username: user.username },
            data: { password: hashed },
        });

        console.log(`Migrated: ${user.username}`);
        migrated++;
    }

    console.log(`\nDone. Migrated: ${migrated}, Skipped (already hashed): ${skipped}`);
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
