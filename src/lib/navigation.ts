
import type { LucideIcon } from "lucide-react";
import {
  ListChecks,
  ArrowRightLeft,
  ShoppingCart,
  CreditCard,
  Landmark,
  FileText,
  Settings,
  LayoutDashboard,
  Network,
  Users
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  label?: string;
  dialogId?: string;
  subItems?: Omit<NavItem, 'icon' | 'subItems' | 'label'>[];
}

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Accounting Flowchart",
    href: "/accounting-flowchart",
    icon: Network,
  },
  {
    title: "Customer",
    href: "#",
    icon: Users,
    subItems: [
      { title: "Customer List", href: "/customer/list", dialogId: "customer-list" },
      { title: "Customer Balance", href: "/customer/balance", dialogId: "customer-balance" },
      { title: "Customer Payment", href: "/customer/payment", dialogId: "customer-payment" },
      { title: "Customer Loyalty Points", href: "/customer/loyalty-points", dialogId: "customer-loyalty-points" },
      { title: "Loyalty Settings", href: "/customer/loyalty-settings", dialogId: "loyalty-settings" },
    ],
  },
  {
    title: "To-Do",
    href: "#",
    icon: ListChecks,
    subItems: [
      { title: "Create first invoice", href: "/todo/create-invoice", dialogId: "create-invoice" },
      { title: "Enter your first payment", href: "/todo/enter-payment", dialogId: "enter-payment" },
      { title: "Run statements", href: "/todo/run-statements" },
      { title: "Set Up Web Access", href: "/todo/web-access" },
    ],
  },
  {
    title: "Transactions",
    href: "#",
    icon: ArrowRightLeft,
    subItems: [
      { title: "Make a payment", href: "/transactions/make-payment" },
      { title: "Receive a payment", href: "/transactions/receive-payment" },
      { title: "Manual journal entry", href: "/transactions/journal-entry", dialogId: "journal-entry" },
      { title: "View journal", href: "/transactions/view-journal", dialogId: "view-journal" },
      { title: "Reconcile account", href: "/banking/reconcile", dialogId: "reconcile-account" },
      { title: "Recalculate Customers' Balances", href: "/transactions/recalculate" },
    ],
  },
  {
    title: "Sales",
    href: "#",
    icon: ShoppingCart,
    subItems: [
      { title: "Create New Invoice", href: "/todo/create-invoice", dialogId: "create-invoice" },
      { title: "Inventory", href: "/sales/inventory", dialogId: "inventory" },
    ],
  },
  {
    title: "Purchases",
    href: "#",
    icon: CreditCard,
    subItems: [
      { title: "Create new order", href: "/purchases/create-order" },
      { title: "Enter New Accounts Payable", href: "/purchases/enter-ap", dialogId: "enter-ap" },
    ]
  },
  {
    title: "Banking",
    href: "#",
    icon: Landmark,
    subItems: [
        { title: "Bank reconciliation", href: "/banking/reconcile", dialogId: "reconcile-account"},
        { title: "Account transfer", href: "/banking/transfer", dialogId: "account-transfer"},
    ]
  },
  {
    title: "Reports",
    href: "#",
    icon: FileText,
    subItems: [
        { title: "Income Statement", href: "/reports/income-statement", dialogId: "income-statement"},
        { title: "Balance Sheet", href: "/reports/balance-sheet", dialogId: "balance-sheet"},
    ]
  },
  {
    title: "Configuration",
    href: "#",
    icon: Settings,
    subItems: [
        { title: "Chart Of Accounts", href: "/configuration/chart-of-accounts", dialogId: "chart-of-accounts" },
        { title: "Back up data", href: "/todo/backup" },
    ]
  }
];

    
