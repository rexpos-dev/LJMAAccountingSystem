"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useDialog } from "@/components/layout/dialog-provider";

interface ReportTileProps {
    title: string;
    href?: string;
    className?: string; // For background color and grid spanning
    onClick?: () => void;
}

const ReportTile = ({ title, href, className, onClick }: ReportTileProps) => {
    if (onClick) {
        return (
            <button
                onClick={onClick}
                className={cn(
                    "flex flex-col justify-end p-4 rounded-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 overflow-hidden text-left w-full",
                    className
                )}
            >
                <span className="font-medium text-base leading-tight break-words">{title}</span>
            </button>
        );
    }

    return (
        <Link
            href={href || "#"}
            className={cn(
                "flex flex-col justify-end p-4 rounded-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 overflow-hidden",
                className
            )}
        >
            <span className="font-medium text-base leading-tight break-words">{title}</span>
        </Link>
    );
};

export default function ReportsPage() {
    const { openDialog } = useDialog();
    const tileClass = "bg-card hover:bg-accent/50 border transition-colors";

    const financialReports = [
        { title: "Balance Sheet", onClick: () => openDialog('balance-sheet'), className: `${tileClass} col-span-2 h-32` },
        { title: "Cash Flow Statement", href: "/reports/cash-flow", className: `${tileClass} col-span-1 h-32` },
        { title: "Trial Balance", href: "/reports/trial-balance", className: `${tileClass} col-span-1 h-32` },
        { title: "Consolidated Reports", href: "/reports/consolidated", className: `${tileClass} col-span-2 h-32` },
        { title: "Income Statement Analysis", href: "/reports/income-statement-analysis", className: `${tileClass} col-span-1 h-32` },
        { title: "Income Statement", onClick: () => openDialog('income-statement'), className: `${tileClass} col-span-1 h-32` },
    ];

    const salesReports = [
        { title: "Invoices Report", href: "/reports/invoices", className: `${tileClass} col-span-2 h-32` },
        { title: "Quotes Report", href: "/reports/quotes", className: `${tileClass} col-span-1 h-32` },
        { title: "Orders Report", href: "/reports/orders", className: `${tileClass} col-span-1 h-32` },
        { title: "Sales Invoice Payment Report", href: "/reports/sales-payments", className: `${tileClass} col-span-2 h-32` },
        { title: "Items Per Customer", href: "/reports/items-per-customer", className: `${tileClass} col-span-1 h-32` },
        { title: "Customer Sales Report", href: "/reports/customer-sales", className: `${tileClass} col-span-1 h-32` },
    ];

    const operationsReports = [
        { title: "Inventory Report", href: "/sales/inventory", className: `${tileClass} col-span-2 h-32` },
        { title: "Item Sales Report", href: "/reports/item-sales", className: `${tileClass} col-span-1 h-32` },
        { title: "Salesperson Report", href: "/reports/salesperson", className: `${tileClass} col-span-1 h-32` },
        { title: "Unpaid Accounts Report", href: "/reports/unpaid-accounts", className: `${tileClass} col-span-2 h-32` },
        { title: "Accounts Payable Report", href: "/reports/accounts-payable", className: `${tileClass} col-span-1 h-32` },
        { title: "Payments Of Accounts Payable Report", href: "/reports/ap-payments", className: `${tileClass} col-span-2 h-32` },
        { title: "Accounts Receivable Aging Report", href: "/reports/ar-aging", className: `${tileClass} col-span-2 h-32` },
        { title: "Customers Report", href: "/reports/customers", className: `${tileClass} col-span-1 h-32` },
    ];

    const complianceReports = [
        { title: "Reconciliation Report", href: "/banking/reconcile", className: `${tileClass} col-span-2 h-32` },
        { title: "Account Enquiry", href: "/reports/account-enquiry", className: `${tileClass} col-span-1 h-32` },
        { title: "Chart Of Accounts", href: "/configuration/chart-of-accounts", className: `${tileClass} col-span-1 h-32` },
        { title: "Mileage Reports", href: "/reports/mileage", className: `${tileClass} col-span-1 h-32` },
        { title: "VAT/Sales Tax Report", href: "/reports/tax", className: `${tileClass} col-span-1 h-32` },
        { title: "Budget Reports", href: "/reports/budget", className: `${tileClass} col-span-1 h-32` },
        { title: "Custom Reports", href: "/reports/custom", className: `${tileClass} col-span-1 h-32` },
    ];

    return (
        <div className="p-4 md:p-8 space-y-6 min-h-full">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Column 1: Financials */}
                <div className="grid grid-cols-2 gap-4 auto-rows-min">
                    {financialReports.map((report, index) => (
                        <ReportTile key={`fin-${index}`} {...report} />
                    ))}
                </div>

                {/* Column 2: Sales */}
                <div className="grid grid-cols-2 gap-4 auto-rows-min">
                    {salesReports.map((report, index) => (
                        <ReportTile key={`sales-${index}`} {...report} />
                    ))}
                </div>

                {/* Column 3: Operations (3-column grid inside) */}
                <div className="grid grid-cols-3 gap-4 auto-rows-min">
                    {operationsReports.map((report, index) => (
                        <ReportTile key={`ops-${index}`} {...report} />
                    ))}
                </div>

                {/* Column 4: Compliance */}
                <div className="grid grid-cols-2 gap-4 auto-rows-min">
                    {complianceReports.map((report, index) => (
                        <ReportTile key={`comp-${index}`} {...report} />
                    ))}
                </div>
            </div>
        </div>
    );
}
