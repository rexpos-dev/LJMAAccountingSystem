import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    const { id } = await params;

    try {
        const job = await prisma.backupJob.findUnique({
            where: { id }
        });

        if (!job || !job.filePath) {
            return NextResponse.json({ error: 'Backup not found' }, { status: 404 });
        }

        // Verify file exists
        if (!fs.existsSync(job.filePath)) {
            return NextResponse.json({ error: 'File missing from server storage' }, { status: 410 }); // 410 Gone
        }

        const fileBuffer = fs.readFileSync(job.filePath);
        const fileName = job.fileName || `backup-${id}.zip`;

        return new NextResponse(fileBuffer as any, {
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': `attachment; filename="${fileName}"`,
                'Content-Length': fileBuffer.length.toString(),
            },
        });

    } catch (error) {
        console.error('Download error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
