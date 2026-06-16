import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';
import { sendEmail } from '@/lib/email';

// POST /api/approval-requests/:id/decide
// Body: { stepId, decision: 'Approved'|'Rejected'|'Returned', remarks? }
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession() as any;
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const { stepId, decision, remarks } = await request.json();
    const decidedBy = `${session.firstName ?? ''} ${session.lastName ?? ''}`.trim() || session.username;

    const approvalReq = await prisma.approvalRequest.findUnique({
        where: { id },
        include: {
            workflow: { include: { steps: { orderBy: { level: 'asc' } } } },
        },
    });
    if (!approvalReq) return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    if (approvalReq.status !== 'Pending') return NextResponse.json({ error: 'Request is no longer pending' }, { status: 400 });

    const step = approvalReq.workflow.steps.find(s => s.id === stepId);
    if (!step) return NextResponse.json({ error: 'Step not found' }, { status: 404 });

    // Record the decision
    await prisma.approvalDecision.create({
        data: {
            requestId: id,
            stepId,
            level: step.level,
            decidedBy,
            decision,
            remarks,
        },
    });

    if (decision === 'Rejected' || decision === 'Returned') {
        await prisma.approvalRequest.update({
            where: { id },
            data: { status: decision === 'Rejected' ? 'Rejected' : 'Pending', currentLevel: 1 },
        });

        await sendEmail({
            to: process.env.NOTIFY_ADMIN_EMAIL ?? '',
            template: 'request_approved',
            data: {
                requestNumber: approvalReq.entityRef ?? approvalReq.entityId,
                status: decision,
                actionBy: decidedBy,
                requesterName: approvalReq.requestedBy,
            },
        });

        return NextResponse.json({ status: decision });
    }

    // Approved — check if there are more levels
    const nextStep = approvalReq.workflow.steps.find(s => s.level === step.level + 1);

    if (nextStep) {
        // Advance to next level
        await prisma.approvalRequest.update({
            where: { id },
            data: { currentLevel: nextStep.level },
        });

        await sendEmail({
            to: process.env.NOTIFY_ADMIN_EMAIL ?? '',
            template: 'request_for_approval',
            data: {
                requestNumber: approvalReq.entityRef ?? approvalReq.entityId,
                formName: approvalReq.entityType,
                requesterName: approvalReq.requestedBy,
                amount: approvalReq.amount,
                role: nextStep.label,
            },
        });

        return NextResponse.json({ status: 'Pending', nextLevel: nextStep.level });
    }

    // All levels approved — mark as fully approved
    await prisma.approvalRequest.update({
        where: { id },
        data: { status: 'Approved' },
    });

    await sendEmail({
        to: process.env.NOTIFY_ADMIN_EMAIL ?? '',
        template: 'request_approved',
        data: {
            requestNumber: approvalReq.entityRef ?? approvalReq.entityId,
            status: 'Fully Approved',
            actionBy: decidedBy,
            requesterName: approvalReq.requestedBy,
        },
    });

    return NextResponse.json({ status: 'Approved' });
}
