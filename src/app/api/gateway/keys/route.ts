import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';
import { generateApiKey } from '@/lib/api-gateway';

export async function GET() {
    const session = await getSession() as any;
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const keys = await prisma.apiKey.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
            id: true, name: true, keyPrefix: true, permissions: true,
            isActive: true, lastUsedAt: true, expiresAt: true, createdAt: true, createdBy: true,
        },
    });

    return NextResponse.json(keys.map(k => ({ ...k, permissions: JSON.parse(k.permissions ?? '[]') })));
}

export async function POST(request: NextRequest) {
    const session = await getSession() as any;
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const adminRoles = ['Super Admin', 'Administrator', 'Admin'];
    if (!adminRoles.includes(session.accountType ?? '')) {
        return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const createdBy = `${session.firstName ?? ''} ${session.lastName ?? ''}`.trim() || session.username;
    const { raw, hash, prefix } = generateApiKey();

    const key = await prisma.apiKey.create({
        data: {
            name: body.name,
            keyHash: hash,
            keyPrefix: prefix,
            permissions: JSON.stringify(body.permissions ?? ['*']),
            isActive: true,
            expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
            createdBy,
        },
    });

    // Return raw key ONCE — it cannot be retrieved again
    return NextResponse.json({
        id: key.id,
        name: key.name,
        apiKey: raw,  // ← show only on creation
        prefix,
        permissions: body.permissions ?? ['*'],
        warning: 'Save this API key now. It will not be shown again.',
    }, { status: 201 });
}
