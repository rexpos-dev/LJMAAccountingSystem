import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';
import { computePayroll } from '@/lib/payroll-ph';

// POST — add/update employee entries for this payroll period
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id: periodId } = await params;
    const { employees } = await request.json();
    // employees: [{ employeeId, employeeName, designation, basicPay, allowances, otherDeductions }]

    const entries = [];
    for (const emp of employees) {
        const result = computePayroll({
            basicPay: parseFloat(emp.basicPay),
            allowances: parseFloat(emp.allowances ?? 0),
        });

        const otherDeductions = parseFloat(emp.otherDeductions ?? 0);
        const totalDeductions = parseFloat((result.totalDeductions + otherDeductions).toFixed(2));
        const netPay = parseFloat((result.grossPay - totalDeductions).toFixed(2));

        const entry = await prisma.payrollEntry.upsert({
            where: {
                // use a composite check via findFirst + create/update
                id: emp.entryId ?? '',
            },
            update: {
                basicPay: result.basicPay,
                allowances: result.allowances,
                grossPay: result.grossPay,
                sssEmployee: result.sssEmployee,
                sssEmployer: result.sssEmployer,
                philhealthEmployee: result.philhealthEmployee,
                philhealthEmployer: result.philhealthEmployer,
                pagibigEmployee: result.pagibigEmployee,
                pagibigEmployer: result.pagibigEmployer,
                withholdingTax: result.withholdingTax,
                otherDeductions,
                totalDeductions,
                netPay,
            },
            create: {
                periodId,
                employeeId: emp.employeeId,
                employeeName: emp.employeeName,
                designation: emp.designation,
                basicPay: result.basicPay,
                allowances: result.allowances,
                grossPay: result.grossPay,
                sssEmployee: result.sssEmployee,
                sssEmployer: result.sssEmployer,
                philhealthEmployee: result.philhealthEmployee,
                philhealthEmployer: result.philhealthEmployer,
                pagibigEmployee: result.pagibigEmployee,
                pagibigEmployer: result.pagibigEmployer,
                withholdingTax: result.withholdingTax,
                otherDeductions,
                totalDeductions,
                netPay,
            },
        });
        entries.push(entry);
    }

    return NextResponse.json({ success: true, count: entries.length, entries });
}
