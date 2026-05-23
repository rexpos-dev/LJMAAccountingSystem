
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FlowchartNode } from "./flowchart-node";
import { FlowchartArrow } from "./flowchart-arrow";
import { useDialog } from "../layout/dialog-context";
import { useAuth } from "../providers/auth-provider";

export function Flowchart() {
  const { openDialog } = useDialog();
  const router = useRouter();
  const { user } = useAuth();

  const canAccessCashSale = user?.accountType === 'Administrator' || (user?.permissions && user.permissions.includes('Non-Invoiced Cash Sale'));
  const isAudit = user?.accountType === 'Audit';

  const handleNodeClick = (action?: string, type: 'dialog' | 'route' = 'dialog') => {
    if (!action) return;
    if (type === 'dialog') {
      openDialog(action as any);
    } else if (type === 'route') {
      router.push(action);
    }
  };

  const nodes = [
    // --- SALES & REVENUE ZONE ---
    {
      id: "non-invoiced-cash-sale",
      content: "Cash Sale",
      description: "Direct walk-in sales",
      icon: "CircleDollarSign",
      accentColor: "#10b981",
      position: { top: 60, left: 100 },
      color: canAccessCashSale && !isAudit ? "bg-emerald-500/10" : "bg-gray-500/10",
      size: { width: 180, height: 90 },
      onClick: canAccessCashSale && !isAudit ? () => handleNodeClick("enter-cash-sale") : undefined,
      disabled: !canAccessCashSale || isAudit
    },
    {
      id: "create-new-invoice",
      content: "New Invoice",
      description: "Billing & credit sales",
      icon: "FilePlus2",
      accentColor: "#3b82f6",
      position: { top: 185, left: 100 },
      color: !isAudit ? "bg-blue-500/10" : "bg-gray-500/10",
      size: { width: 180, height: 90 },
      onClick: !isAudit ? () => handleNodeClick("create-invoice") : undefined,
      disabled: isAudit
    },
    {
      id: "invoices",
      content: "Invoices",
      description: "Manage billed sales",
      icon: "FileText",
      accentColor: "#3b82f6",
      position: { top: 310, left: 35 },
      color: "bg-blue-600/20",
      size: { width: 150, height: 85 },
      onClick: () => handleNodeClick("invoice-list")
    },
    {
      id: "customers",
      content: "Customers",
      description: "Client directory",
      icon: "Users",
      accentColor: "#3b82f6",
      position: { top: 310, left: 195 },
      color: "bg-blue-600/20",
      size: { width: 150, height: 85 },
      onClick: () => handleNodeClick("customer-list")
    },
    {
      id: "apply-customer-payment",
      content: "Apply Payment",
      description: "Receive collections",
      icon: "HandCoins",
      accentColor: "#3b82f6",
      position: { top: 435, left: 100 },
      color: !isAudit ? "bg-blue-700/20" : "bg-gray-500/10",
      size: { width: 180, height: 90 },
      onClick: !isAudit ? () => handleNodeClick("customer-payment") : undefined,
      disabled: isAudit
    },

    // --- PURCHASES & PAYABLES ZONE ---
    {
      id: "immediate-payment",
      content: "Cash Purchase",
      description: "Direct expenses",
      icon: "Receipt",
      accentColor: "#f59e0b",
      position: { top: 60, left: 470 },
      color: !isAudit ? "bg-amber-500/10" : "bg-gray-500/10",
      size: { width: 180, height: 90 },
      onClick: () => handleNodeClick("enter-payments"),
      disabled: isAudit
    },
    {
      id: "enter-new-ap",
      content: "Enter Bill",
      description: "Record accounts payable",
      icon: "ClipboardPen",
      accentColor: "#f59e0b",
      position: { top: 185, left: 470 },
      color: !isAudit ? "bg-amber-500/10" : "bg-gray-500/10",
      size: { width: 180, height: 90 },
      onClick: () => handleNodeClick("enter-ap"),
      disabled: isAudit
    },
    {
      id: "suppliers",
      content: "Suppliers",
      description: "Vendor directory",
      icon: "Truck",
      accentColor: "#f59e0b",
      position: { top: 310, left: 405 },
      color: "bg-amber-600/20",
      size: { width: 150, height: 85 },
      onClick: () => handleNodeClick("supplier-list")
    },
    {
      id: "accounts-payable",
      content: "Payables",
      description: "Manage bills",
      icon: "Library",
      accentColor: "#f59e0b",
      position: { top: 310, left: 565 },
      color: "bg-amber-600/20",
      size: { width: 150, height: 85 },
      onClick: () => handleNodeClick("accounts-payable")
    },
    {
      id: "pay-bill",
      content: "Pay Bill",
      description: "Settle accounts payable",
      icon: "WalletCards",
      accentColor: "#f59e0b",
      position: { top: 435, left: 470 },
      color: !isAudit ? "bg-amber-700/20" : "bg-gray-500/10",
      size: { width: 180, height: 90 },
      onClick: () => handleNodeClick("enter-payments-of-accounts-payable"),
      disabled: isAudit
    },

    // --- FINANCIAL REPORTS ZONE ---
    {
      id: "income-statement",
      content: "P & L",
      icon: "TrendingUp",
      accentColor: "#8b5cf6",
      position: { top: 60, left: 810 },
      color: "bg-violet-600/20",
      size: { width: 150, height: 80 },
      onClick: () => handleNodeClick("income-statement")
    },
    {
      id: "journal",
      content: "Journal",
      icon: "BookOpenText",
      accentColor: "#8b5cf6",
      position: { top: 60, left: 990 },
      color: "bg-violet-600/20",
      size: { width: 150, height: 80 },
      onClick: () => handleNodeClick('view-journal')
    },
    {
      id: "general-ledger",
      content: "GL",
      icon: "BookKey",
      accentColor: "#8b5cf6",
      position: { top: 60, left: 1170 },
      color: "bg-violet-600/20",
      size: { width: 150, height: 80 },
      onClick: () => handleNodeClick("general-ledger-dialog")
    },
    {
      id: "balance-sheet",
      content: "Balance Sheet",
      description: "Financial Position",
      icon: "Scale",
      accentColor: "#8b5cf6",
      position: { top: 185, left: 935 },
      color: "bg-violet-700/20",
      size: { width: 260, height: 100 },
      onClick: () => handleNodeClick("balance-sheet")
    },

    // --- MAINTENANCE ZONE ---
    {
      id: "chart-of-accounts",
      content: "Accounts",
      icon: "LayoutList",
      accentColor: "#6366f1",
      position: { top: 375, left: 990 },
      color: "bg-indigo-600/20",
      size: { width: 150, height: 80 },
      onClick: () => handleNodeClick("chart-of-accounts")
    },
    {
      id: "reconcile-accounts",
      content: "Reconcile",
      icon: "RotateCw",
      accentColor: "#06b6d4",
      position: { top: 500, left: 900 },
      color: !isAudit ? "bg-cyan-600/20" : "bg-gray-500/10",
      size: { width: 155, height: 80 },
      onClick: () => handleNodeClick("reconcile-account"),
      disabled: isAudit
    },
    {
      id: "transfer-between-accounts",
      content: "Transfer",
      icon: "ArrowLeftRight",
      accentColor: "#06b6d4",
      position: { top: 500, left: 1085 },
      color: !isAudit ? "bg-cyan-600/20" : "bg-gray-500/10",
      size: { width: 155, height: 80 },
      onClick: () => handleNodeClick("account-transfer"),
      disabled: isAudit
    },
  ];

  const arrows = [
    { from: "create-new-invoice", to: "invoices", fromDirection: 'bottom', toDirection: 'top' },
    { from: "create-new-invoice", to: "customers", fromDirection: 'bottom', toDirection: 'top' },
    { from: "invoices", to: "apply-customer-payment", fromDirection: 'bottom', toDirection: 'top' },
    { from: "customers", to: "apply-customer-payment", fromDirection: 'bottom', toDirection: 'top' },
    { from: "enter-new-ap", to: "suppliers", fromDirection: 'bottom', toDirection: 'top' },
    { from: "enter-new-ap", to: "accounts-payable", fromDirection: 'bottom', toDirection: 'top' },
    { from: "suppliers", to: "pay-bill", fromDirection: 'bottom', toDirection: 'top' },
    { from: "accounts-payable", to: "pay-bill", fromDirection: 'bottom', toDirection: 'top' },
  ];

  const nodeMap = new Map(nodes.map(node => [node.id, node]));

  return (
    <div className="relative min-h-[650px] w-[1400px] bg-background/20 rounded-3xl border border-foreground/5 p-4 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.15] [background-image:radial-gradient(circle_at_center,#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Zone Indicators */}
      <div className="absolute top-6 left-10 flex flex-col gap-1 pointer-events-none">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/60 text-center w-[360px]">Sales & Revenue</span>
      </div>
      <div className="absolute top-6 left-[400px] flex flex-col gap-1 pointer-events-none">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500/60 text-center w-[360px]">Purchases & Payables</span>
      </div>
      <div className="absolute top-6 left-[790px] flex flex-col gap-1 pointer-events-none">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-500/60 text-center w-[570px]">Financial Reporting</span>
      </div>
      <div className="absolute top-[330px] left-[790px] flex flex-col gap-1 pointer-events-none">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-500/60 text-center w-[570px]">Banking & Maintenance</span>
      </div>

      {/* Zones Glass Backgrounds */}
      <div className="absolute top-12 left-34 w-[360px] h-[550px] bg-emerald-500/5 rounded-[2rem] border border-emerald-500/10 pointer-events-none" />
      <div className="absolute top-12 left-[400px] w-[360px] h-[550px] bg-amber-500/5 rounded-[2rem] border border-amber-500/10 pointer-events-none" />
      <div className="absolute top-12 left-[790px] w-[570px] h-[250px] bg-violet-500/5 rounded-[2rem] border border-violet-500/10 pointer-events-none" />
      <div className="absolute top-[350px] left-[790px] w-[570px] h-[250px] bg-cyan-500/5 rounded-[2rem] border border-cyan-500/10 pointer-events-none" />

      {nodes.map((node) => (
        <FlowchartNode key={node.id} {...node as any} />
      ))}
      {arrows.map((arrow, index) => {
        const fromNode = nodeMap.get(arrow.from);
        const toNode = nodeMap.get(arrow.to);
        if (!fromNode || !toNode) return null;
        return <FlowchartArrow key={index} fromNode={fromNode as any} toNode={toNode as any} fromDirection={arrow.fromDirection as any} toDirection={arrow.toDirection as any} />;
      })}
    </div>
  );
}
