import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';
import { postJournalEntry } from '@/lib/journal-helper';

// POST /api/payroll/:id/post — posts payroll journal entries to GL
// Debit: Salaries Expense (configurable), SSS/PhilHealth/PagIBIG Employer Expense
// Credit: SSS Payable, PhilHealth Payable, PagIBIG Payable, Tax Payable, Cash/Bank
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession() as any;
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body = await request.json();
    // Expect account numbers from body (configured by admin)
    const {
        salaryExpenseAccount = 5100,   // Salaries & Wages
        sssPayableAccount = 2200,      // SSS Payable
        phPayableAccount = 2201,       // PhilHealth Payable
        hdmfPayableAccount = 2202,     // Pag-IBIG Payable
        taxPayableAccount = 2203,      // Withholding Tax Payable
        cashAccount = 1001,            // Cash / Bank
    } = body;

    const period = await prisma.payrollPeriod.findUnique({
        where: { id },
        include: { entries: true },
    });

    if (!period) return NextResponse.json({ error: 'Period not found' }, { status: 404 });
    if (period.status === 'Posted') return NextResponse.json({ error: 'Already posted' }, { status: 400 });
    if (period.entries.length === 0) return NextResponse.json({ error: 'No payroll entries' }, { status: 400 });

    const totals = period.entries.reduce((acc, e) => ({
        grossPay: acc.grossPay + e.grossPay,
        sssEmployee: acc.sssEmployee + e.sssEmployee,
        sssEmployer: acc.sssEmployer + e.sssEmployer,
        phEmployee: acc.phEmployee + e.philhealthEmployee,
        phEmployer: acc.phEmployer + e.philhealthEmployer,
        hdmfEmployee: acc.hdmfEmployee + e.pagibigEmployee,
        hdmfEmployer: acc.hdmfEmployer + e.pagibigEmployer,
        tax: acc.tax + e.withholdingTax,
        netPay: acc.netPay + e.netPay,
    }), {
        grossPay: 0, sssEmployee: 0, sssEmployer: 0,
        phEmployee: 0, phEmployer: 0, hdmfEmployee: 0,
        hdmfEmployer: 0, tax: 0, netPay: 0,
    });

    const postedBy = `${session.firstName ?? ''} ${session.lastName ?? ''}`.trim() || session.username;
    const ref = `PAY-${period.name.replace(/\s+/g, '-').toUpperCase()}`;

    // Total expense = grossPay + employer shares
    const totalSSSExp = totals.sssEmployee + totals.sssEmployer;
    const totalPHExp = totals.phEmployee + totals.phEmployer;
    const totalHDMFExp = totals.hdmfEmployee + totals.hdmfEmployer;

    await postJournalEntry({
        date: period.payDate,
        referenceId: ref,
        particulars: `Payroll — ${period.name}`,
        user: postedBy,
        lines: [
            // Debits
            { accountNo: salaryExpenseAccount, debit: totals.grossPay, credit: 0 },
            { accountNo: salaryExpenseAccount, debit: totals.sssEmployer + totals.phEmployer + totals.hdmfEmployer, credit: 0 },
            // Credits
            { accountNo: sssPayableAccount, debit: 0, credit: totalSSSExp },
            { accountNo: phPayableAccount, debit: 0, credit: totalPHExp },
            { accountNo: hdmfPayableAccount, debit: 0, credit: totalHDMFExp },
            { accountNo: taxPayableAccount, debit: 0, credit: totals.tax },
            { accountNo: cashAccount, debit: 0, credit: totals.netPay },
        ],
    });

    await prisma.payrollPeriod.update({
        where: { id },
        data: { status: 'Posted' },
    });

    await prisma.payrollEntry.updateMany({
        where: { periodId: id },
        data: { posted: true },
    });

    return NextResponse.json({ success: true, totals });
}
