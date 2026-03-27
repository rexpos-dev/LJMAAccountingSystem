"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useDialog } from "@/components/layout/dialog-provider";

interface ReportTileProps {
    title: string;
    href?: string;
    className?: string; // For background color and grid spanning
    onClick?: () => void;
    isActive?: boolean;
}

const ReportTile = ({ title, href, className, onClick, isActive }: ReportTileProps) => {
    const activeClass = isActive ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500/30 font-semibold" : "";

    if (onClick) {
        return (
            <button
                onClick={onClick}
                className={cn(
                    "flex flex-col justify-end p-4 rounded-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 overflow-hidden text-left w-full",
                    className,
                    activeClass
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
                className,
                activeClass
            )}
        >
            <span className="font-medium text-base leading-tight break-words">{title}</span>
        </Link>
    );
};

export default function ReportsPage() {
    const { openDialog } = useDialog();
    const tileClass = "bg-card hover:bg-accent/50 border transition-colors";

    const [summary, setSummary] = useState<any>({});

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await fetch('/api/reports/summary');
                if (res.ok) {
                    const data = await res.json();
                    setSummary(data);
                }
            } catch (e) {
                console.error('Failed to fetch summary');
            }
        };
        fetchSummary();
    }, []);

    const financialReports = [
        { title: "Balance Sheet", onClick: () => openDialog('balance-sheet'), className: `${tileClass} col-span-2 h-32`, isActive: summary.hasFinancials },
        { title: "Cash Flow Statement", onClick: () => openDialog('cash-flow-statement-dialog'), className: `${tileClass} col-span-1 h-32`, isActive: summary.hasFinancials },
        { title: "Trial Balance", onClick: () => openDialog('trial-balance-dialog'), className: `${tileClass} col-span-1 h-32`, isActive: summary.hasFinancials },
        { title: "Consolidated Reports", onClick: () => openDialog('consolidated-reports-dialog'), className: `${tileClass} col-span-2 h-32`, isActive: summary.hasFinancials },
        { title: "Income Statement Analysis", onClick: () => openDialog('income-statement-analysis-dialog'), className: `${tileClass} col-span-1 h-32`, isActive: summary.hasFinancials },
        { title: "Income Statement", onClick: () => openDialog('income-statement'), className: `${tileClass} col-span-1 h-32`, isActive: summary.hasFinancials },
    ];

    const salesReports = [
        { title: "Invoices Report", onClick: () => openDialog('invoices-report-dialog'), className: `${tileClass} col-span-2 h-32`, isActive: summary.hasInvoices },
        { title: "Cash Advance Report", onClick: () => openDialog('cash-advance-report-dialog'), className: `${tileClass} col-span-1 h-32`, isActive: summary.hasOrders },
        { title: "Orders Report", onClick: () => openDialog('orders-report-dialog'), className: `${tileClass} col-span-1 h-32`, isActive: summary.hasOrders },
        { title: "Sales Invoice Payment Report", onClick: () => openDialog('sales-invoice-payment-report-dialog'), className: `${tileClass} col-span-2 h-32`, isActive: summary.hasInvoices },
        { title: "Items Per Customer", onClick: () => openDialog('items-per-customer-report-dialog'), className: `${tileClass} col-span-1 h-32`, isActive: summary.hasCustomers },
        { title: "Customer Sales Report", onClick: () => openDialog('customer-sales-report-dialog'), className: `${tileClass} col-span-1 h-32`, isActive: summary.hasInvoices },

    ];

    const operationsReports = [
        { title: "Inventory Report", onClick: () => openDialog('inventory-report-dialog'), className: `${tileClass} col-span-2 h-32`, isActive: summary.hasProducts },
        { title: "Item Sales Report", onClick: () => openDialog('item-sales-report-dialog'), className: `${tileClass} col-span-1 h-32`, isActive: summary.hasProducts },
        { title: "Salesperson Report", onClick: () => openDialog('salesperson-report-dialog'), className: `${tileClass} col-span-1 h-32` },
        { title: "Unpaid Accounts Report", onClick: () => openDialog('unpaid-accounts-report-dialog'), className: `${tileClass} col-span-2 h-32`, isActive: summary.hasInvoices },
        { title: "Accounts Payable Report", onClick: () => openDialog('accounts-payable-report-dialog'), className: `${tileClass} col-span-1 h-32`, isActive: summary.hasInvoices },
        { title: "Payments Of Accounts Payable Report", onClick: () => openDialog('ap-payments-report-dialog'), className: `${tileClass} col-span-2 h-32`, isActive: summary.hasInvoices },
        { title: "Accounts Receivable Aging Report", onClick: () => openDialog('ar-aging-report-dialog'), className: `${tileClass} col-span-2 h-32`, isActive: summary.hasInvoices },
        { title: "Customers Report", onClick: () => openDialog('customers-report-dialog'), className: `${tileClass} col-span-1 h-32`, isActive: summary.hasCustomers },
        { title: "Consignment/Outright Report", onClick: () => openDialog('consignment-outright-report-dialog'), className: `${tileClass} col-span-3 h-32`, isActive: summary.hasInvoices },
    ];

    const complianceReports = [
        { title: "To Audit Items", onClick: () => openDialog('to-audit-report' as any), className: `${tileClass} col-span-2 h-32`, isActive: summary.hasFinancials },
        { title: "Reconciliation Report", onClick: () => openDialog('reconciliation-report-dialog' as any), className: `${tileClass} col-span-1 h-32`, isActive: summary.hasFinancials },
        { title: "Account Enquiry", onClick: () => openDialog('account-enquiry-report-dialog' as any), className: `${tileClass} col-span-1 h-32`, isActive: summary.hasFinancials },
        { title: "Chart Of Accounts", onClick: () => openDialog('chart-of-accounts-report-dialog' as any), className: `${tileClass} col-span-1 h-32`, isActive: summary.hasFinancials },
        { title: "Mileage Reports", onClick: () => openDialog('mileage-report-dialog' as any), className: `${tileClass} col-span-1 h-32`, isActive: summary.hasFinancials },
        { title: "VAT/Sales Tax Report", onClick: () => openDialog('tax-report-dialog' as any), className: `${tileClass} col-span-1 h-32`, isActive: summary.hasFinancials },
        { title: "Budget Reports", onClick: () => openDialog('budget-report-dialog' as any), className: `${tileClass} col-span-1 h-32`, isActive: summary.hasFinancials },
        { title: "Custom Reports", onClick: () => openDialog('custom-report-dialog' as any), className: `${tileClass} col-span-1 h-32`, isActive: summary.hasFinancials },
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
