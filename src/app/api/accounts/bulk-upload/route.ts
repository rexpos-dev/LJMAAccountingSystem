import { NextResponse } from 'next/server';
import { createAccount, upsertAccount } from '@/lib/database';
import { parseCSV, validateAccountsCSV, mapCSVRowToAccount } from '@/lib/bulk-upload-accounts-utils';
import type { Account } from '@/types/account';

import { appendFileSync } from 'fs';
import { join } from 'path';

export async function POST(request: Request) {
    const logPath = join(process.cwd(), 'bulk-upload-debug.log');
    appendFileSync(logPath, `\n[${new Date().toISOString()}] Bulk upload started\n`);
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Parse CSV
        const data = await parseCSV(file);
        appendFileSync(logPath, `Parsed ${data.length} rows\n`);
        console.log(`[BulkUpload] Parsed ${data.length} rows from CSV`);

        // Validate CSV
        const validation = validateAccountsCSV(data);
        appendFileSync(logPath, `Validation result: ${validation.isValid}, Errors: ${validation.errors.length}\n`);
        console.log(`[BulkUpload] Validation result: ${validation.isValid}, Errors: ${validation.errors.length}`);

        if (!validation.isValid) {
            appendFileSync(logPath, `Validation failed: ${JSON.stringify(validation.errors)}\n`);
            console.log('[BulkUpload] Validation failed:', validation.errors);
            return NextResponse.json({
                success: false,
                error: 'Validation failed',
                errors: validation.errors
            }, { status: 400 });
        }

        console.log(`[BulkUpload] Processing ${validation.data.length} validated rows`);
        appendFileSync(logPath, `Processing ${validation.data.length} validated rows\n`);

        // Process accounts
        const createdAccounts: any[] = [];
        const errors: any[] = [];

        for (const row of validation.data) {
            try {
                const accountData = mapCSVRowToAccount(row);

                // Upsert account in database
                const account = (await upsertAccount({
                    ...accountData,
                    account_description: accountData.account_description || undefined,
                    account_type: accountData.account_type || accountData.account_category || 'Asset',
                    fs_category: accountData.fs_category || undefined,
                    account_type_no: 1
                })) as Account;

                appendFileSync(logPath, `Processed account (created/updated): ${account.account_no}\n`);
                console.log(`[BulkUpload] Processed account: ${account.account_no}`);

                createdAccounts.push({
                    account_no: account.account_no,
                    account_name: account.account_name,
                    account_category: account.account_category
                });
            } catch (error: any) {
                appendFileSync(logPath, `Error creating account ${row['Account No.']}: ${error.message}\n`);
                console.error('Error creating account:', error);

                // Handle duplicate account number
                if (error.code === 'P2002') {
                    errors.push({
                        account_no: mapCSVRowToAccount(row).account_no,
                        error: 'Account number already exists'
                    });
                } else {
                    errors.push({
                        account_no: mapCSVRowToAccount(row).account_no,
                        error: error.message || 'Failed to create account'
                    });
                }
            }
        }

        // Return results
        if (createdAccounts.length === 0) {
            return NextResponse.json({
                success: false,
                error: 'No accounts were created',
                message: 'All accounts failed to upload. Check for duplicate account numbers.',
                errors
            }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            message: `Successfully processed ${createdAccounts.length} account(s)${errors.length > 0 ? ` with ${errors.length} error(s)` : ''}`,
            createdAccounts,
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (error: any) {
        appendFileSync(logPath, `Critical error: ${error.message}\n`);
        console.error('Bulk upload error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to process bulk upload'
        }, { status: 500 });
    }
}
