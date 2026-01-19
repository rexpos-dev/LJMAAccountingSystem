
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FlowchartNode } from "./flowchart-node";
import { FlowchartArrow } from "./flowchart-arrow";
import { useDialog } from "../layout/dialog-provider";
import { useAuth } from "../providers/auth-provider";

export function Flowchart() {
  const { openDialog } = useDialog();
  const router = useRouter();
  const { user } = useAuth();

  // Permission check for "Non-Invoiced Cash Sale"
  // Allowed if Administrator or if permissions JSON string contains the specific permission
  const canAccessCashSale = user?.accountType === 'Administrator' || (user?.permissions && user.permissions.includes('Non-Invoiced Cash Sale'));

  const handleNodeClick = (action?: string, type: 'dialog' | 'route' = 'dialog') => {
    if (!action) return;

    if (type === 'dialog') {
      openDialog(action as any);
    } else if (type === 'route') {
      router.push(action);
    }
  };

  const nodes = [
    // Customer Facing
    {
      id: "non-invoiced-cash-sale",
      content: "Non-Invoiced Cash Sale",
      position: { top: 0, left: 50 },
      color: canAccessCashSale ? "bg-gray-600" : "bg-gray-400",
      size: { width: 200, height: 100 },
      onClick: canAccessCashSale ? () => handleNodeClick("enter-cash-sale") : undefined,
      disabled: !canAccessCashSale
    },
    { id: "create-new-invoice", content: "Create New Invoice", position: { top: 150, left: 50 }, color: "bg-gray-600", size: { width: 200, height: 100 }, onClick: () => handleNodeClick("create-invoice") },
    { id: "invoices", content: "Invoices", position: { top: 300, left: 0 }, color: "bg-gray-700", size: { width: 150, height: 80 }, onClick: () => handleNodeClick("invoice-list") },
    { id: "customers", content: "Customers", position: { top: 300, left: 175 }, color: "bg-gray-700", size: { width: 150, height: 80 }, onClick: () => handleNodeClick("customer-list") },
    { id: "apply-customer-payment", content: "Apply Customer's Payment", position: { top: 430, left: 50 }, color: "bg-gray-800", size: { width: 200, height: 100 }, onClick: () => handleNodeClick("customer-payment") },

    // Accounts Payable
    { id: "immediate-payment", content: "Immediate Payment Or Purchase", position: { top: 0, left: 400 }, color: "bg-gray-600", size: { width: 200, height: 100 }, onClick: () => handleNodeClick("enter-payment") },
    { id: "enter-new-ap", content: "Enter New Accounts Payable", position: { top: 150, left: 400 }, color: "bg-gray-600", size: { width: 200, height: 100 }, onClick: () => handleNodeClick("enter-ap") },
    { id: "suppliers", content: "Suppliers", position: { top: 300, left: 350 }, color: "bg-gray-700", size: { width: 120, height: 80 }, onClick: () => handleNodeClick("supplier-list") },
    { id: "accounts-payable", content: "Accounts Payable", position: { top: 300, left: 510 }, color: "bg-gray-700", size: { width: 120, height: 80 }, onClick: () => handleNodeClick("accounts-payable") },
    { id: "pay-bill", content: "Pay A Bill Previously Entered", position: { top: 430, left: 400 }, color: "bg-gray-800", size: { width: 200, height: 100 }, onClick: () => handleNodeClick("enter-payments-of-accounts-payable") },

    // Reports
    { id: "income-statement", content: "Income Statement", position: { top: 0, left: 700 }, color: "bg-gray-700", size: { width: 150, height: 80 }, onClick: () => handleNodeClick("income-statement") },
    { id: "journal", content: "Journal", position: { top: 0, left: 870 }, color: "bg-gray-700", size: { width: 150, height: 80 }, onClick: () => handleNodeClick('view-journal') },
    { id: "balance-sheet", content: "Balance Sheet", position: { top: 150, left: 780 }, color: "bg-gray-800", size: { width: 200, height: 100 }, onClick: () => handleNodeClick("balance-sheet") },

    // Budgets & Chart of Accounts
    { id: "manage-budgets", content: "Manage Budgets", position: { top: 300, left: 700 }, color: "bg-gray-700", size: { width: 150, height: 80 }, disabled: true },
    { id: "chart-of-accounts", content: "Chart Of Accounts", position: { top: 300, left: 870 }, color: "bg-gray-600", size: { width: 150, height: 80 }, onClick: () => handleNodeClick("chart-of-accounts") },

    // Reconciliation
    { id: "reconcile-accounts", content: "Reconcile Accounts", position: { top: 430, left: 700 }, color: "bg-yellow-600", size: { width: 150, height: 80 }, onClick: () => handleNodeClick("reconcile-account") },
    { id: "transfer-between-accounts", content: "Transfer Between Accounts", position: { top: 430, left: 870 }, color: "bg-yellow-600", size: { width: 150, height: 80 }, onClick: () => handleNodeClick("account-transfer") },

    // Options
    { id: "configure-express-accounts", content: "Configure Express Accounts (Options)", position: { top: 0, left: 1040 }, color: "bg-gray-600", size: { width: 200, height: 100 } },
  ];

  const arrows = [
    // Customer Arrows
    { from: "create-new-invoice", to: "invoices", fromDirection: 'bottom', toDirection: 'top' },
    { from: "create-new-invoice", to: "customers", fromDirection: 'bottom', toDirection: 'top' },
    { from: "invoices", to: "apply-customer-payment", fromDirection: 'bottom', toDirection: 'top' },
    { from: "customers", to: "apply-customer-payment", fromDirection: 'bottom', toDirection: 'top' },

    // AP Arrows
    { from: "enter-new-ap", to: "suppliers", fromDirection: 'bottom', toDirection: 'top' },
    { from: "enter-new-ap", to: "accounts-payable", fromDirection: 'bottom', toDirection: 'top' },
    { from: "suppliers", to: "pay-bill", fromDirection: 'bottom', toDirection: 'top' },
    { from: "accounts-payable", to: "pay-bill", fromDirection: 'bottom', toDirection: 'top' },
  ];

  const nodeMap = new Map(nodes.map(node => [node.id, node]));

  return (
    <div className="relative min-h-[550px] w-full">
      {nodes.map((node) => (
        <FlowchartNode key={node.id} {...node} />
      ))}
      {arrows.map((arrow, index) => {
        const fromNode = nodeMap.get(arrow.from);
        const toNode = nodeMap.get(arrow.to);
        if (!fromNode || !toNode) return null;
        return <FlowchartArrow key={index} fromNode={fromNode} toNode={toNode} fromDirection={arrow.fromDirection as any} toDirection={arrow.toDirection as any} />;
      })}
    </div>
  );
}
