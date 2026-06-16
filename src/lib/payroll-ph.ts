/**
 * Philippine payroll contribution computations.
 * Rates: SSS 2024, PhilHealth 2024, Pag-IBIG, BIR TRAIN Law
 */

// ─── SSS (2024) ───────────────────────────────────────────────────────────────
// Monthly Salary Credit brackets. Employee: 4.5%, Employer: 9.5%
const SSS_BRACKETS = [
    [4249.99, 4000],
    [4749.99, 4500],
    [5249.99, 5000],
    [5749.99, 5500],
    [6249.99, 6000],
    [6749.99, 6500],
    [7249.99, 7000],
    [7749.99, 7500],
    [8249.99, 8000],
    [8749.99, 8500],
    [9249.99, 9000],
    [9749.99, 9500],
    [10249.99, 10000],
    [10749.99, 10500],
    [11249.99, 11000],
    [11749.99, 11500],
    [12249.99, 12000],
    [12749.99, 12500],
    [13249.99, 13000],
    [13749.99, 13500],
    [14249.99, 14000],
    [14749.99, 14500],
    [15249.99, 15000],
    [15749.99, 15500],
    [16249.99, 16000],
    [16749.99, 16500],
    [17249.99, 17000],
    [17749.99, 17500],
    [18249.99, 18000],
    [18749.99, 18500],
    [19249.99, 19000],
    [19749.99, 19500],
    [20249.99, 20000],
    [20749.99, 20500],
    [21249.99, 21000],
    [21749.99, 21500],
    [22249.99, 22000],
    [22749.99, 22500],
    [23249.99, 23000],
    [23749.99, 23500],
    [24249.99, 24000],
    [24749.99, 24500],
    [25249.99, 25000],
    [25749.99, 25500],
    [26249.99, 26000],
    [26749.99, 26500],
    [27249.99, 27000],
    [27749.99, 27500],
    [28249.99, 28000],
    [28749.99, 28500],
    [29249.99, 29000],
    [29749.99, 29500],
    [Infinity, 30000],
] as const;

export function computeSSS(monthlyBasic: number): { employee: number; employer: number; msc: number } {
    let msc = 30000;
    for (const [ceiling, credit] of SSS_BRACKETS) {
        if (monthlyBasic <= ceiling) { msc = credit; break; }
    }
    return {
        msc,
        employee: parseFloat((msc * 0.045).toFixed(2)),
        employer: parseFloat((msc * 0.095).toFixed(2)),
    };
}

// ─── PhilHealth (2024 — 5% total, 2.5% each) ─────────────────────────────────
export function computePhilHealth(monthlyBasic: number): { employee: number; employer: number } {
    const total = Math.min(Math.max(monthlyBasic * 0.05, 500), 5000);
    const half = parseFloat((total / 2).toFixed(2));
    return { employee: half, employer: half };
}

// ─── Pag-IBIG / HDMF ─────────────────────────────────────────────────────────
export function computePagIbig(monthlyBasic: number): { employee: number; employer: number } {
    const rate = monthlyBasic <= 1500 ? 0.01 : 0.02;
    const employee = parseFloat(Math.min(monthlyBasic * rate, 100).toFixed(2));
    const employer = parseFloat(Math.min(monthlyBasic * 0.02, 100).toFixed(2));
    return { employee, employer };
}

// ─── BIR Withholding Tax (TRAIN Law — monthly basis) ─────────────────────────
// Based on monthly taxable income after mandatory deductions
export function computeWithholdingTax(monthlyTaxableIncome: number): number {
    if (monthlyTaxableIncome <= 20833) return 0;
    if (monthlyTaxableIncome <= 33332) return parseFloat(((monthlyTaxableIncome - 20833) * 0.20).toFixed(2));
    if (monthlyTaxableIncome <= 66666) return parseFloat((2500 + (monthlyTaxableIncome - 33333) * 0.25).toFixed(2));
    if (monthlyTaxableIncome <= 166666) return parseFloat((10833 + (monthlyTaxableIncome - 66667) * 0.30).toFixed(2));
    if (monthlyTaxableIncome <= 666666) return parseFloat((40833.33 + (monthlyTaxableIncome - 166667) * 0.32).toFixed(2));
    return parseFloat((200833.33 + (monthlyTaxableIncome - 666667) * 0.35).toFixed(2));
}

// ─── Full payroll computation for one employee ───────────────────────────────
export interface PayrollInput {
    basicPay: number;     // monthly basic
    allowances?: number;  // non-taxable allowances
}

export interface PayrollResult {
    basicPay: number;
    allowances: number;
    grossPay: number;
    sssEmployee: number;
    sssEmployer: number;
    philhealthEmployee: number;
    philhealthEmployer: number;
    pagibigEmployee: number;
    pagibigEmployer: number;
    totalMandatoryDeductions: number;  // employee share only
    taxableIncome: number;
    withholdingTax: number;
    totalDeductions: number;
    netPay: number;
}

export function computePayroll(input: PayrollInput): PayrollResult {
    const { basicPay, allowances = 0 } = input;
    const grossPay = basicPay + allowances;

    const sss = computeSSS(basicPay);
    const ph = computePhilHealth(basicPay);
    const hdmf = computePagIbig(basicPay);

    const totalMandatoryDeductions = sss.employee + ph.employee + hdmf.employee;
    const taxableIncome = grossPay - totalMandatoryDeductions;
    const withholdingTax = computeWithholdingTax(taxableIncome);
    const totalDeductions = totalMandatoryDeductions + withholdingTax;
    const netPay = parseFloat((grossPay - totalDeductions).toFixed(2));

    return {
        basicPay,
        allowances,
        grossPay: parseFloat(grossPay.toFixed(2)),
        sssEmployee: sss.employee,
        sssEmployer: sss.employer,
        philhealthEmployee: ph.employee,
        philhealthEmployer: ph.employer,
        pagibigEmployee: hdmf.employee,
        pagibigEmployer: hdmf.employer,
        totalMandatoryDeductions: parseFloat(totalMandatoryDeductions.toFixed(2)),
        taxableIncome: parseFloat(taxableIncome.toFixed(2)),
        withholdingTax,
        totalDeductions: parseFloat(totalDeductions.toFixed(2)),
        netPay,
    };
}
