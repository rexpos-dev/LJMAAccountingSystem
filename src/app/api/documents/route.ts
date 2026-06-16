import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';
import { saveUploadedFile } from '@/lib/upload';

// GET /api/documents?entityType=invoice&entityId=xxx
export async function GET(request: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get('entityType');
    const entityId = searchParams.get('entityId');

    if (!entityType || !entityId) {
        return NextResponse.json({ error: 'entityType and entityId are required' }, { status: 400 });
    }

    const docs = await prisma.document.findMany({
        where: { entityType, entityId },
        orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(docs);
}

// POST /api/documents — multipart/form-data with file + entityType + entityId
export async function POST(request: NextRequest) {
    const session = await getSession() as any;
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const formData = await request.formData();
        const entityType = formData.get('entityType') as string;
        const entityId = formData.get('entityId') as string;

        if (!entityType || !entityId) {
            return NextResponse.json({ error: 'entityType and entityId are required' }, { status: 400 });
        }

        const uploadedBy = `${session.firstName ?? ''} ${session.lastName ?? ''}`.trim() || session.username;
        const { fileName, originalName, mimeType, size } = await saveUploadedFile(formData, entityType);

        const doc = await prisma.document.create({
            data: { entityType, entityId, fileName, originalName, mimeType, size, uploadedBy },
        });

        return NextResponse.json(doc, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 400 });
    }
}
