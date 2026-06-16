import path from 'path';
import fs from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

const execAsync = promisify(exec);
const BACKUP_DIR = path.join(process.cwd(), 'backups', 'auto');
const KEEP_DAYS = 7;

function ensureBackupDir() {
    if (!existsSync(BACKUP_DIR)) mkdirSync(BACKUP_DIR, { recursive: true });
}

function formatBytes(bytes: number): string {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Runs a mysqldump and stores the file in backups/auto/.
 * Purges backups older than 7 days.
 * Logs result to AutoBackupLog table.
 * Sends email notification to NOTIFY_ADMIN_EMAIL.
 */
export async function runAutoBackup(): Promise<void> {
    ensureBackupDir();

    const dbUrl = process.env.DATABASE_URL ?? '';
    // Parse mysql://user:pass@host:port/dbname
    const match = dbUrl.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
    if (!match) throw new Error('Cannot parse DATABASE_URL for backup');

    const [, user, pass, host, port, dbName] = match;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const fileName = `backup_${timestamp}.sql`;
    const filePath = path.join(BACKUP_DIR, fileName);

    let status: 'success' | 'failed' = 'success';
    let errorMsg: string | undefined;
    let sizeBytes = BigInt(0);

    try {
        const cmd = `mysqldump -h ${host} -P ${port} -u ${user} -p${pass} ${dbName} > "${filePath}"`;
        await execAsync(cmd);

        const stat = await fs.stat(filePath);
        sizeBytes = BigInt(stat.size);

        // Purge old backups (> KEEP_DAYS)
        const files = await fs.readdir(BACKUP_DIR);
        const cutoff = Date.now() - KEEP_DAYS * 24 * 60 * 60 * 1000;
        for (const f of files) {
            if (!f.startsWith('backup_') || !f.endsWith('.sql')) continue;
            const fp = path.join(BACKUP_DIR, f);
            const fstat = await fs.stat(fp);
            if (fstat.mtimeMs < cutoff) await fs.unlink(fp);
        }
    } catch (err: any) {
        status = 'failed';
        errorMsg = err.message;
    }

    // Log to database
    try {
        await prisma.autoBackupLog.create({
            data: {
                fileName,
                filePath,
                sizeBytes,
                status,
                error: errorMsg,
            },
        });
    } catch { /* non-fatal */ }

    // Send email notification
    const adminEmail = process.env.NOTIFY_ADMIN_EMAIL;
    if (adminEmail) {
        await sendEmail({
            to: adminEmail,
            template: status === 'success' ? 'backup_complete' : 'generic',
            data: status === 'success'
                ? {
                    date: new Date().toLocaleDateString('en-PH', { dateStyle: 'long' }),
                    fileName,
                    size: formatBytes(Number(sizeBytes)),
                }
                : {
                    subject: '❌ Auto Backup Failed',
                    message: `Automated backup failed at ${new Date().toLocaleString('en-PH')}. Error: ${errorMsg}`,
                },
        });
    }
}
