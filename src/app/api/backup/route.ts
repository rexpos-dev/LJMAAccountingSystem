import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, getSession } from '@/lib/auth-server';
import { createBackupJob, processBackup } from '@/lib/backup-service';

// GET: List recent backup jobs
export async function GET(request: NextRequest) {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    try {
        const backups = await prisma.backupJob.findMany({
            orderBy: { createdAt: 'desc' },
            take: 20
        });

        return NextResponse.json(backups);
    } catch (error: any) {
        console.error('Failed to fetch backups:', error);
        return NextResponse.json({ error: 'Failed to fetch backups', details: error.message }, { status: 500 });
    }
}

// POST: Trigger new backup
export async function POST(request: NextRequest) {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    try {
        const session = await getSession();
        // Assuming session object has 'username' or 'id'
        const userId = (session as any).username || 'system';

        // Check for already running job to prevent duplicates?
        const runningJob = await prisma.backupJob.findFirst({
            where: { status: 'RUNNING' }
        });

        if (runningJob) {
            return NextResponse.json({ error: 'A backup job is already in progress.' }, { status: 409 });
        }

        const job = await createBackupJob(userId);

        // Run in background (do not await)
        processBackup(job.id).catch(err => console.error('Background backup error:', err));

        return NextResponse.json({ message: 'Backup started', jobId: job.id }, { status: 202 });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to start backup' }, { status: 500 });
    }
}
