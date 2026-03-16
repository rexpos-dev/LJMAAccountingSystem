import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> } // Await params in next 15
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { status, assignee, remarks, notifyUserId } = body;

        // Prepare update data
        const updateData: any = {};
        if (status) updateData.status = status;
        if (assignee !== undefined) updateData.assignee = assignee;
        if (remarks !== undefined) updateData.remarks = remarks;

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: "No fields provided to update" }, { status: 400 });
        }

        const log = await prisma.auditLog.update({
            where: { id },
            data: updateData
        });

        // Trigger Posting/Activation Logic for Bank Transactions
        if (status && log.actionType?.toLowerCase().includes("bank") && log.transactionId) {
            try {
                if (log.actionType === 'Bank Registration') {
                    if (status === "Done Audit") {
                        await prisma.bankAccount.update({ where: { id: log.transactionId }, data: { audit_status: 'DONE' } });
                    } else if (status === "Ongoing Audit") {
                        await prisma.bankAccount.update({ where: { id: log.transactionId }, data: { audit_status: 'ONGOING' } });
                    } else if (status === "To Audit") {
                        await prisma.bankAccount.update({ where: { id: log.transactionId }, data: { audit_status: 'TO_AUDIT' } });
                    }
                } else if (status === "Done Audit") {
                    // Phase 2: Post Transaction to GL
                    const { postBankTransactionToGL } = await import("@/lib/banking-service");
                    await postBankTransactionToGL(log.transactionId, log.assignee || 'System');
                }
            } catch (postError) {
                console.error("Failed to process bank audit approval action:", postError);
            }
        }

        return NextResponse.json(log);
    } catch (error: any) {
        console.error("Failed to update audit log:", error);
        return NextResponse.json(
            { error: "Failed to update audit log", details: error.message },
            { status: 500 }
        );
    }
}
