import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, getSession } from '@/lib/auth-server';
import mysqldump from 'mysqldump';
import fs from 'fs';
import path from 'path';

// Table mappings for each module
const MODULE_TABLES: Record<string, string[]> = {
    'transactions': ['transactions', 'pos_sales', 'pos_sale_item', 'invoice', 'invoice_item', 'customer_payments', 'bank_transactions', 'bank_reconciliations', 'payables_ledger', 'audit_log'],
    'chart-of-accounts': ['chart_of_account', 'account_type'],
    'banks': ['bank_accounts', 'bank_transactions', 'bank_reconciliations'],
    'user-permissions': ['user_permission'],
    'sales-users': ['sales_user'],
    'customers': ['customer', 'loyalty_point', 'loyalty_point_setting'],
    'employees': ['employee']
};

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
        const moduleKey = searchParams.get('module');

        if (!moduleKey) {
            return NextResponse.json({ error: 'No module specified.' }, { status: 400 });
        }

        const tables = MODULE_TABLES[moduleKey];
        if (!tables) {
            return NextResponse.json({ error: 'Invalid module specified.' }, { status: 400 });
        }

        const connectionUrl = process.env.DATABASE_URL;
        if (!connectionUrl) {
            return NextResponse.json({ error: 'DATABASE_URL not configured' }, { status: 500 });
        }

        // Parse connection URL
        const url = new URL(connectionUrl);
        const dbName = url.pathname.substring(1);

        // Ensure backup directory exists
        const backupDir = path.join(process.cwd(), 'storage', 'backups');
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        const timestamp = Date.now();
        const tempFilePath = path.join(backupDir, `temp-module-${moduleKey}-${timestamp}.sql`);

        // Generate the SQL dump for specific tables
        await mysqldump({
            connection: {
                host: url.hostname,
                user: url.username,
                password: url.password,
                database: dbName,
                port: parseInt(url.port || '3306'),
            },
            dumpToFile: tempFilePath,
            dump: {
                tables: tables,
            }
        });

        // Read the generated SQL
        const sqlContent = fs.readFileSync(tempFilePath, 'utf8');
        
        // Cleanup temp file
        fs.unlinkSync(tempFilePath);

        // Return the data as a SQL file
        return new NextResponse(sqlContent, {
            status: 200,
            headers: {
                'Content-Type': 'application/sql',
                'Content-Disposition': `attachment; filename="backup-${moduleKey}-${new Date().toISOString().slice(0, 10)}.sql"`,
                'Content-Length': Buffer.byteLength(sqlContent).toString(),
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

