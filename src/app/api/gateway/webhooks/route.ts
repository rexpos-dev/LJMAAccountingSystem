import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';
import crypto from 'crypto';

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const subs = await prisma.webhookSubscription.findMany({
        include: { deliveries: { orderBy: { deliveredAt: 'desc' }, take: 3 } },
        orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(subs.map(s => ({ ...s, events: JSON.parse(s.events ?? '[]') })));
}

export async function POST(request: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const secret = crypto.randomBytes(32).toString('hex');

    const sub = await prisma.webhookSubscription.create({
        data: {
            name: body.name,
            url: body.url,
            events: JSON.stringify(body.events ?? ['*']),
            secret,
            isActive: body.isActive ?? true,
        },
    });

    return NextResponse.json({
        ...sub,
        events: body.events ?? ['*'],
        secret,  // show secret once for HMAC verification setup
        warning: 'Store this secret securely. Use it to verify X-LJMA-Signature headers.',
    }, { status: 201 });
}
