import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, getSession } from '@/lib/auth-server';

// POST: Execute a database management action
export async function POST(request: NextRequest) {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    try {
        const session = await getSession();
        const username = (session as any)?.username || 'system';
        const body = await request.json();
        const { action, confirmationCode } = body;

        // Verify the security confirmation code
        if (!confirmationCode || confirmationCode !== 'CONFIRM-RESET') {
            return NextResponse.json(
                { error: 'Invalid confirmation code. Please type CONFIRM-RESET to proceed.' },
                { status: 400 }
            );
        }

        let result: { message: string; deletedCount?: number } = { message: '' };

        switch (action) {
            case 'reset-transactions': {
                // Delete bank transactions first (FK dependency)
                await prisma.bankTransaction.deleteMany({});
                // Delete bank reconciliations
                await prisma.bankReconciliation.deleteMany({});
                // Delete payables ledger
                await prisma.payablesLedger.deleteMany({});
                // Delete POS sale items then POS sales
                await prisma.posSaleItem.deleteMany({});
                await prisma.posSale.deleteMany({});
                // Delete customer payments
                await prisma.customerPayment.deleteMany({});
                // Delete invoice items then invoices
                await prisma.invoiceItem.deleteMany({});
                await prisma.invoice.deleteMany({});
                // Delete main transactions
                const deleted = await prisma.transaction.deleteMany({});
                // Delete audit logs
                await prisma.auditLog.deleteMany({});

                result = { message: 'All transaction records have been reset successfully.', deletedCount: deleted.count };
                break;
            }

            case 'reset-chart-of-accounts': {
                // Must delete bank transactions, reconciliations, bank accounts first
                await prisma.bankTransaction.deleteMany({});
                await prisma.bankReconciliation.deleteMany({});
                await prisma.bankAccount.deleteMany({});
                const deleted = await prisma.account.deleteMany({});
                result = { message: 'Chart of Accounts has been reset successfully.', deletedCount: deleted.count };
                break;
            }

            case 'reset-banks': {
                await prisma.bankTransaction.deleteMany({});
                await prisma.bankReconciliation.deleteMany({});
                const deleted = await prisma.bankAccount.deleteMany({});
                result = { message: 'Bank accounts have been reset successfully.', deletedCount: deleted.count };
                break;
            }

            case 'reset-user-permissions': {
                // Delete chat relations first
                await prisma.chatAttachment.deleteMany({});
                await prisma.chatMessage.deleteMany({});
                await prisma.chatParticipant.deleteMany({});
                // Keep the current admin user, delete others
                const deleted = await prisma.userPermission.deleteMany({
                    where: {
                        NOT: {
                            username: username
                        }
                    }
                });
                result = { message: `User permissions reset. Your account was preserved. ${deleted.count} users removed.`, deletedCount: deleted.count };
                break;
            }

            case 'reset-sales-users': {
                const deleted = await prisma.salesUser.deleteMany({});
                result = { message: 'Sales users have been reset successfully.', deletedCount: deleted.count };
                break;
            }

            case 'reset-customers': {
                // Delete loyalty points first
                await prisma.loyaltyPoint.deleteMany({});
                // Delete invoice items, invoices
                await prisma.invoiceItem.deleteMany({});
                await prisma.invoice.deleteMany({});
                // Delete customer payments
                await prisma.customerPayment.deleteMany({});
                const deleted = await prisma.customer.deleteMany({});
                result = { message: 'Customer records have been reset successfully.', deletedCount: deleted.count };
                break;
            }

            case 'reset-employees': {
                const deleted = await prisma.employee.deleteMany({});
                result = { message: 'Employee directory has been reset successfully.', deletedCount: deleted.count };
                break;
            }

            default:
                return NextResponse.json({ error: 'Invalid action specified.' }, { status: 400 });
        }

        // Log the action to audit
        try {
            await prisma.auditLog.create({
                data: {
                    actionType: `Database Reset: ${action}`,
                    details: `${result.message} Performed by: ${username}`,
                    status: 'Audited',
                    initiatedBy: username,
                    auditedBy: username,
                    auditedAt: new Date(),
                }
            });
        } catch {
            // Don't fail the operation if audit logging fails
            console.warn('Failed to create audit log for database reset action');
        }

        return NextResponse.json(result);

    } catch (error: any) {
        console.error('Database management error:', error);
        return NextResponse.json(
            { error: 'Operation failed', details: error.message },
            { status: 500 }
        );
    }
}

// GET: Download a backup for a specific module
export async function GET(request: NextRequest) {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    try {
        const { searchParams } = new URL(request.url);
        const module = searchParams.get('module');

        if (!module) {
            return NextResponse.json({ error: 'No module specified.' }, { status: 400 });
        }

        let data: any = {};

        switch (module) {
            case 'transactions':
                data = {
                    transactions: await prisma.transaction.findMany(),
                    posSales: await prisma.posSale.findMany({ include: { items: true } }),
                    invoices: await prisma.invoice.findMany({ include: { items: true } }),
                    customerPayments: await prisma.customerPayment.findMany(),
                    bankTransactions: await prisma.bankTransaction.findMany(),
                    bankReconciliations: await prisma.bankReconciliation.findMany(),
                    payablesLedger: await prisma.payablesLedger.findMany(),
                    auditLogs: await prisma.auditLog.findMany(),
                };
                break;

            case 'chart-of-accounts':
                data = {
                    accounts: await prisma.account.findMany(),
                    accountTypes: await prisma.accountType.findMany(),
                };
                break;

            case 'banks':
                data = {
                    bankAccounts: await prisma.bankAccount.findMany(),
                    bankTransactions: await prisma.bankTransaction.findMany(),
                };
                break;

            case 'user-permissions':
                data = {
                    userPermissions: await prisma.userPermission.findMany(),
                };
                break;

            case 'sales-users':
                data = {
                    salesUsers: await prisma.salesUser.findMany(),
                };
                break;

            case 'customers':
                data = {
                    customers: await prisma.customer.findMany({ include: { loyaltyPoints: true } }),
                    customerPayments: await prisma.customerPayment.findMany(),
                };
                break;

            case 'employees':
                data = {
                    employees: await prisma.employee.findMany(),
                };
                break;

            default:
                return NextResponse.json({ error: 'Invalid module specified.' }, { status: 400 });
        }

        // Return the data as a JSON file
        return new NextResponse(JSON.stringify(data, null, 2), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Content-Disposition': `attachment; filename="backup-${module}-${new Date().toISOString().slice(0, 10)}.json"`,
            },
        });

    } catch (error: any) {
        console.error('Backup download error:', error);
        return NextResponse.json(
            { error: 'Failed to generate backup', details: error.message },
            { status: 500 }
        );
    }
}
