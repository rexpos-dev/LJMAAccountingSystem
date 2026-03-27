import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const requestData: any = await prisma.$queryRaw`
            SELECT * FROM request WHERE id = ${id}
        `;

        if (!requestData || requestData.length === 0) {
            return NextResponse.json({ error: 'Request not found' }, { status: 404 });
        }

        const items = await prisma.$queryRaw`
            SELECT * FROM request_item WHERE requestId = ${id}
        `;

        return NextResponse.json({
            ...requestData[0],
            items
        });
    } catch (error) {
        console.error('Error fetching request:', error);
        return NextResponse.json({ error: 'Failed to fetch request' }, { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const now = new Date();

        // --- Handle individual field updates (non-status) ---
        if (body.depositAccount !== undefined) {
            await prisma.$executeRaw`UPDATE request SET depositAccount = ${body.depositAccount}, updatedAt = ${now} WHERE id = ${id}`;
        }
        if (body.verifiedBy !== undefined) {
            await prisma.$executeRaw`UPDATE request SET verifiedBy = ${body.verifiedBy}, updatedAt = ${now} WHERE id = ${id}`;
        }
        if (body.approvedBy !== undefined) {
            await prisma.$executeRaw`UPDATE request SET approvedBy = ${body.approvedBy}, updatedAt = ${now} WHERE id = ${id}`;
        }
        if (body.processedBy !== undefined) {
            await prisma.$executeRaw`UPDATE request SET processedBy = ${body.processedBy}, updatedAt = ${now} WHERE id = ${id}`;
        }

        // --- Handle status update ---
        if (body.status) {
            console.log(`[API] Updating request ${id} status to: ${body.status}`);
            await prisma.$executeRaw`UPDATE request SET status = ${body.status}, updatedAt = ${now} WHERE id = ${id}`;

            // =============================================================
            // RELEASE PAYMENT FLOW
            // Triggered when status is set to 'Released' or 'Received'
            // =============================================================
            if (body.status === 'Released' || body.status === 'Received') {
                console.log(`[API] Triggering Release Payment flow for status: ${body.status}`);
                const existingReqs: any[] = await prisma.$queryRaw`SELECT * FROM request WHERE id = ${id}`;

                if (existingReqs && existingReqs.length > 0) {
                    const reqData = existingReqs[0];

                    // Fetch request items (for inventory & product tracking)
                    const requestItems: any[] = await prisma.$queryRaw`
                        SELECT ri.*, p.id as product_db_id, p.stockQuantity
                        FROM request_item ri
                        LEFT JOIN product p ON p.id = ri.productId
                        WHERE ri.requestId = ${id}
                    `;

                    const amount = reqData.amount || 0;
                    const chargeToAcct = parseInt(reqData.chargeTo, 10);
                    const depositAcct = parseInt(reqData.depositAccount, 10);
                    const releasedBy = body.releasedBy || reqData.processedBy || 'Treasurer';
                    const isCashAdvance = reqData.formName === 'REQUEST AND AUTHORIZATION OF CASH ADVANCES';

                    // ----------------------------------------------------------
                    // 1. JOURNAL ENTRIES (Accounting)
                    // ----------------------------------------------------------
                    if (!isNaN(chargeToAcct) && !isNaN(depositAcct) && amount > 0) {
                        try {
                            const { postJournalEntry } = await import('@/lib/journal-helper');
                            await postJournalEntry({
                                date: now,
                                referenceId: reqData.requestNumber,
                                particulars: `Released Payment: ${reqData.purpose || reqData.formName || 'Disbursement'} - ${reqData.requesterName}`,
                                user: releasedBy,
                                lines: [
                                    { accountNo: chargeToAcct, debit: amount, credit: 0 },
                                    { accountNo: depositAcct, debit: 0, credit: amount },
                                ]
                            });
                            console.log(`[RELEASE] Journal Entry posted for ${reqData.requestNumber}`);
                        } catch (err: any) {
                            // Log but do not block. Journal errors are logged to console and audit.
                            console.error(`[RELEASE] Journal Entry failed for ${reqData.requestNumber}:`, err.message);
                        }
                    } else {
                        console.warn(`[RELEASE] Skipped Journal Entry for ${reqData.requestNumber}: missing chargeTo/depositAccount or zero amount.`);
                    }

                    // ----------------------------------------------------------
                    // 2. ACCOUNTS PAYABLE (AP) - PayablesLedger
                    // ----------------------------------------------------------
                    try {
                        // Fetch account info for AP ledger record
                        const chargeAccount: any[] = !isNaN(chargeToAcct)
                            ? await prisma.$queryRaw`SELECT account_no, account_name FROM chart_of_account WHERE account_no = ${chargeToAcct} LIMIT 1`
                            : [];

                        await prisma.payablesLedger.create({
                            data: {
                                date: now,
                                reference: reqData.requestNumber,
                                ledger: 'Disbursement',
                                accountNumber: chargeAccount[0]?.account_no?.toString() || reqData.chargeTo,
                                accountName: chargeAccount[0]?.account_name || 'Expense Account',
                                accountDescription: reqData.purpose || reqData.formName,
                                debitAmount: amount,
                                creditAmount: 0,
                                user: releasedBy,
                            }
                        });
                        console.log(`[RELEASE] AP Payables Ledger entry created for ${reqData.requestNumber}`);
                    } catch (err: any) {
                        console.error(`[RELEASE] AP Ledger failed for ${reqData.requestNumber}:`, err.message);
                    }

                    // ----------------------------------------------------------
                    // 3. INVENTORY - InventoryTransaction + Stock Update
                    // Only processes items with a linked productId
                    // ----------------------------------------------------------
                    for (const item of requestItems) {
                        if (!item.productId) continue;
                        try {
                            // Create an inventory withdrawal record
                            await prisma.inventoryTransaction.create({
                                data: {
                                    productId: item.productId,
                                    type: 'Disbursement Out',
                                    quantity: -(item.quantity || 0), // Negative = stock reduction
                                    referenceId: reqData.requestNumber,
                                    status: 'Completed',
                                }
                            });

                            // Decrement stock quantity on the Product record
                            await prisma.product.update({
                                where: { id: item.productId },
                                data: { stockQuantity: { decrement: item.quantity || 0 } }
                            });
                            console.log(`[RELEASE] Inventory updated: Product ${item.productId}, Qty -${item.quantity}`);
                        } catch (err: any) {
                            console.error(`[RELEASE] Inventory update failed for product ${item.productId}:`, err.message);
                        }
                    }

                    // ----------------------------------------------------------
                    // 4. ADVANCES - Update cash advance requests to "Settled"
                    // ----------------------------------------------------------
                    if (isCashAdvance) {
                        try {
                            await prisma.$executeRaw`
                                UPDATE request SET status = 'Settled', updatedAt = ${now}
                                WHERE id = ${id} AND formName = 'REQUEST AND AUTHORIZATION OF CASH ADVANCES'
                            `;
                            console.log(`[RELEASE] Cash advance ${reqData.requestNumber} marked as Settled.`);
                        } catch (err: any) {
                            console.error(`[RELEASE] Advances update failed:`, err.message);
                        }
                    }

                    // ----------------------------------------------------------
                    // 5. AUDIT TRAIL - Log the Release action explicitly
                    // ----------------------------------------------------------
                    try {
                        await prisma.auditLog.create({
                            data: {
                                date: now,
                                actionType: 'Payment Released',
                                transactionId: reqData.requestNumber,
                                details: `Payment released for Request #${reqData.requestNumber} | Payee: ${reqData.requesterName} | Amount: ₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })} | Form: ${reqData.formName || 'Disbursement Slip'} | Released by: ${releasedBy}`,
                                amount: amount,
                                status: 'To Audit',
                                initiatedBy: releasedBy,
                            }
                        });
                        console.log(`[RELEASE] Audit trail logged for ${reqData.requestNumber}`);
                    } catch (err: any) {
                        console.error(`[RELEASE] Audit log failed:`, err.message);
                    }
                }
            }
        }

        // If no recognized field in body
        const hasAnyUpdate = body.status || body.depositAccount !== undefined ||
            body.verifiedBy !== undefined || body.approvedBy !== undefined || body.processedBy !== undefined;

        if (!hasAnyUpdate) {
            return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating request:', error);
        return NextResponse.json({ error: 'Failed to update request' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Delete items first
        await prisma.$executeRaw`DELETE FROM request_item WHERE requestId = ${id}`;

        // Delete request
        await prisma.$executeRaw`DELETE FROM request WHERE id = ${id}`;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting request:', error);
        return NextResponse.json({ error: 'Failed to delete request' }, { status: 500 });
    }
}
