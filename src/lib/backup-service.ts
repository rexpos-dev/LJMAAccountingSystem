import mysqldump from 'mysqldump';
import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

const BACKUP_DIR = path.join(process.cwd(), 'storage', 'backups');

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

export async function createBackupJob(userId: string) {
    return await prisma.backupJob.create({
        data: {
            status: 'PENDING',
            createdBy: userId,
            log: 'Backup job created.',
        }
    });
}

export async function processBackup(jobId: string) {
    console.log(`Starting backup job ${jobId}`);
    try {
        await prisma.backupJob.update({
            where: { id: jobId },
            data: { status: 'RUNNING', log: 'Starting backup process...' }
        });

        const connectionUrl = process.env.DATABASE_URL;
        if (!connectionUrl) throw new Error('DATABASE_URL not found');

        // Parse connection URL (assuming mysql://user:pass@host:port/db)
        const url = new URL(connectionUrl);
        const dbName = url.pathname.substring(1);

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `backup_${dbName}_${timestamp}`;
        const sqlPath = path.join(BACKUP_DIR, `${fileName}.sql`);
        const zipPath = path.join(BACKUP_DIR, `${fileName}.zip`);

        // 1. Dump Database
        await prisma.backupJob.update({ where: { id: jobId }, data: { log: 'Dumping database...' } });

        await mysqldump({
            connection: {
                host: url.hostname,
                user: url.username,
                password: url.password,
                database: dbName,
                port: parseInt(url.port || '3306'),
            },
            dumpToFile: sqlPath,
        });

        // 2. Compress
        await prisma.backupJob.update({ where: { id: jobId }, data: { log: 'Compressing backup file...' } });

        await new Promise((resolve, reject) => {
            const output = fs.createWriteStream(zipPath);
            const archive = archiver('zip', { zlib: { level: 9 } });

            output.on('close', () => resolve(undefined));
            archive.on('error', (err) => reject(err));

            archive.pipe(output);
            archive.file(sqlPath, { name: `${fileName}.sql` });
            archive.finalize();
        });

        // 3. Cleanup SQL file
        fs.unlinkSync(sqlPath);

        // 4. Update Job
        const stats = fs.statSync(zipPath);
        const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2) + ' MB';

        await prisma.backupJob.update({
            where: { id: jobId },
            data: {
                status: 'COMPLETED',
                filePath: zipPath,
                fileName: `${fileName}.zip`,
                fileSize: fileSizeMB,
                completedAt: new Date(),
                log: 'Backup completed successfully.'
            }
        });

        console.log(`Backup job ${jobId} completed.`);

    } catch (error: any) {
        console.error(`Backup job ${jobId} failed:`, error);
        await prisma.backupJob.update({
            where: { id: jobId },
            data: {
                status: 'FAILED',
                log: `Failed: ${error.message}`,
                completedAt: new Date()
            }
        });
    }
}
