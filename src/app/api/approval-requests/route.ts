import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';
import { sendEmail } from '@/lib/email';
import { sendAdminSMS } from '@/lib/sms';

export async function GET(request: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const entityType = searchParams.get('entityType');

    const requests = await prisma.approvalRequest.findMany({
        where: {
            ...(status ? { status } : {}),
            ...(entityType ? { entityType } : {}),
        },
        include: {
            workflow: { include: { steps: { orderBy: { level: 'asc' } } } },
            decisions: { orderBy: { decidedAt: 'asc' } },
        },
        orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(requests);
}

// POST — initiate a new approval request
export async function POST(request: NextRequest) {
    const session = await getSession() as any;
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { workflowId, entityType, entityId, entityRef, amount } = body;

    const workflow = await prisma.approvalWorkflow.findUnique({
        where: { id: workflowId },
        include: { steps: { orderBy: { level: 'asc' } } },
    });
    if (!workflow) return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });

    // Find applicable first step based on amount
    const firstStep = workflow.steps
        .filter(s => s.level === 1)
        .find(s =>
            (s.minAmount === null || amount >= s.minAmount) &&
            (s.maxAmount === null || amount <= s.maxAmount)
        ) ?? workflow.steps.find(s => s.level === 1);

    if (!firstStep) return NextResponse.json({ error: 'No applicable approval step for this amount' }, { status: 400 });

    const requestedBy = `${session.firstName ?? ''} ${session.lastName ?? ''}`.trim() || session.username;

    const approvalReq = await prisma.approvalRequest.create({
        data: {
            workflowId,
            entityType,
            entityId,
            entityRef: entityRef ?? entityId,
            amount: parseFloat(amount),
            currentLevel: 1,
            requestedBy,
        },
    });

    // Notify approvers for level 1
    const adminEmail = process.env.NOTIFY_ADMIN_EMAIL;
    if (adminEmail) {
        await sendEmail({
            to: adminEmail,
            template: 'request_for_approval',
            data: {
                requestNumber: entityRef ?? entityId,
                formName: entityType,
                requesterName: requestedBy,
                amount,
                role: firstStep.label,
            },
        });
    }
    await sendAdminSMS('request_for_approval', {
        requestNumber: entityRef ?? entityId,
        formName: entityType,
        role: firstStep.label,
    });

    return NextResponse.json(approvalReq, { status: 201 });
}
