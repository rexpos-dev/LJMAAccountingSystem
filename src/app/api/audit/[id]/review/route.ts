import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { postBankTransactionToGL } from "@/lib/banking-service";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { decision, remarks, assignee, assigneeId } = body;

        if (!decision || !['APPROVE', 'REJECT', 'ASSIGN_ONLY'].includes(decision)) {
            return NextResponse.json({ error: "Invalid decision" }, { status: 400 });
        }

        const result = await prisma.$transaction(async (tx) => {
            // 1. Fetch the audit log
            const log = await tx.auditLog.findUnique({
                where: { id },
            });

            if (!log) throw new Error("Audit log not found");
            if (log.status === 'Audited') throw new Error("Item already audited");

            // 2. Update Audit Log
            const updatedLog = await tx.auditLog.update({
                where: { id },
                data: {
                    status: decision === 'APPROVE' ? 'Audited' : decision === 'REJECT' ? 'To Audit' : log.status, // Keep status as is if ASSIGN_ONLY
                    remarks: remarks !== undefined ? remarks : log.remarks,
                    assignee: assignee !== undefined ? assignee : log.assignee,
                    auditedAt: decision === 'APPROVE' || decision === 'REJECT' ? new Date() : log.auditedAt,
                }
            });

            // 3. Handle the source transaction logic (Skip if ASSIGN_ONLY)
            if (decision !== 'ASSIGN_ONLY' && log.transactionId) {
                if (log.actionType === 'Bank Registration') {
                    await tx.bankAccount.update({
                        where: { id: log.transactionId },
                        data: { audit_status: decision === 'APPROVE' ? 'DONE' : 'TO_AUDIT' }
                    });
                } else if (log.actionType?.toLowerCase().includes("bank")) {
                    if (decision === 'APPROVE') {
                        // Update bank transaction to APPROVED first
                        await tx.bankTransaction.updateMany({
                            where: { id: log.transactionId },
                            data: { status: 'APPROVED' }
                        });

                        // postBankTransactionToGL will update it to POSTED
                        // Note: We use the imported function but it might need a tx-safe version if we want it in this transaction
                    } else {
                        // Reject: Return to DRAFT
                        await tx.bankTransaction.updateMany({
                            where: { id: log.transactionId },
                            data: { status: 'DRAFT' }
                        });
                    }
                }
            }

            // 4. Create Notification for Assignee if provided
            if (assigneeId && (decision === 'ASSIGN_ONLY' || assignee !== log.assignee)) {
                const notifId = crypto.randomUUID();
                const now = new Date();
                const actionDesc = updatedLog.actionType || 'Audit Item';
                const refNo = updatedLog.transactionId || id;

                const auditLink = `/audit`;
                await tx.$executeRaw`
                    INSERT INTO notification (id, type, title, message, entityId, link, userId, isRead, createdAt)
                    VALUES (${notifId}, 'AUDIT_ASSIGNMENT', 'New Audit assigned to you', ${`You have been assigned to audit ${actionDesc} (${refNo}).`}, ${id}, ${auditLink}, ${assigneeId}, 0, ${now})
                `;
            }

            return updatedLog;
        });

        // If it was an approval and we are outside the atomic block for the posting (postBankTransactionToGL does its own tx)
        if (decision === 'APPROVE') {
            const log = await prisma.auditLog.findUnique({ where: { id } });
            if (log?.transactionId && log.actionType?.toLowerCase().includes("bank") && log.actionType !== 'Bank Registration') {
                await postBankTransactionToGL(log.transactionId, 'Auditor');
            }
        }

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Failed to process audit review:", error);

        const isClientError = error.message === "Item already audited" || error.message === "Audit log not found";

        return NextResponse.json(
            { error: isClientError ? error.message : "Failed to process audit review", details: error.message },
            { status: isClientError ? 400 : 500 }
        );
    }
}
