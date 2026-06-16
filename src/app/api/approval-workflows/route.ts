import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const workflows = await prisma.approvalWorkflow.findMany({
        include: { steps: { orderBy: { level: 'asc' } } },
        orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(workflows);
}

export async function POST(request: NextRequest) {
    const session = await getSession() as any;
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();

    const workflow = await prisma.approvalWorkflow.create({
        data: {
            name: body.name,
            description: body.description,
            entityType: body.entityType,
            isActive: body.isActive ?? true,
            steps: {
                create: (body.steps ?? []).map((s: any) => ({
                    level: s.level,
                    label: s.label,
                    minAmount: s.minAmount ?? null,
                    maxAmount: s.maxAmount ?? null,
                    requiredRole: s.requiredRole,
                    escalateAfterHours: s.escalateAfterHours ?? 24,
                })),
            },
        },
        include: { steps: { orderBy: { level: 'asc' } } },
    });

    return NextResponse.json(workflow, { status: 201 });
}
