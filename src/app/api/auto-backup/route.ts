import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';
import { runAutoBackup } from '@/lib/auto-backup';

// GET — list backup logs
export async function GET(request: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const logs = await prisma.autoBackupLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 30,
    });

    return NextResponse.json(logs);
}

// POST — trigger a manual backup (Admin only)
export async function POST(request: NextRequest) {
    const session = await getSession() as any;
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const adminRoles = ['Administrator', 'Super Admin', 'Admin'];
    if (!adminRoles.includes(session.accountType ?? '')) {
        return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    try {
        await runAutoBackup();
        const latest = await prisma.autoBackupLog.findFirst({ orderBy: { createdAt: 'desc' } });
        return NextResponse.json({ success: true, log: latest });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
