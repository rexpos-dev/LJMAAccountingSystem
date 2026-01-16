import type { LucideIcon } from "lucide-react";
import {
  ListChecks,
  ArrowRightLeft,
  ShoppingCart,
  CreditCard,
  Landmark,
  FileText,
  Settings,
  Settings2,
  LayoutDashboard,
  Network,
  Users,
  ClipboardList
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  label?: string;
  dialogId?: string;
  subItems?: Omit<NavItem, 'icon' | 'subItems' | 'label'>[];
  permissions?: string[];
  hideForRoles?: string[];
}

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    permissions: ['Dashboard'],
  },
  {
    title: "Accounting Flowchart",
    href: "/accounting-flowchart",
    icon: Network,
    permissions: ['Dashboard'], // Assuming dashboard access allows this
  },
  {
    title: "Customer",
    href: "#",
    icon: Users,
    permissions: ['Customers'],
    subItems: [
      { title: "Customer List", href: "/customer/list", dialogId: "customer-list" },
      { title: "Customer Balance", href: "/customer/balance", dialogId: "customer-balance", permissions: ['Customer Balances'] },
      { title: "Customer Payment", href: "/customer/payment", dialogId: "customer-payment", permissions: ['Customer Payment'], hideForRoles: ['Auditor'] },
      { title: "Customer Loyalty Points", href: "/customer/loyalty-points", dialogId: "customer-loyalty-points", permissions: ['Customer Loyalty Points'] },
      { title: "Loyalty Settings", href: "/customer/loyalty-settings", dialogId: "loyalty-settings", permissions: ['Loyalty Points Setting'], hideForRoles: ['Auditor'] },
    ],
  },
  {
    title: "To-Do",
    href: "#",
    icon: ListChecks,
    hideForRoles: ['Auditor'], // Auditors don't do To-Do tasks
    subItems: [
      { title: "Create first invoice", href: "/todo/create-invoice", dialogId: "create-invoice" },
      { title: "Enter your first payment", href: "/todo/enter-payment", dialogId: "enter-payment" },
      { title: "Run statements", href: "/todo/run-statements" },
    ],
  },
  {
    title: "Transactions",
    href: "#",
    icon: ArrowRightLeft,
    hideForRoles: ['Auditor'], // Transactional actions disabled
    subItems: [
      { title: "Make a payment", href: "/transactions/make-payment" },
      { title: "Receive a payment", href: "/transactions/receive-payment" },
      { title: "Manual journal entry", href: "/transactions/journal-entry", dialogId: "journal-entry" },
      { title: "View journal", href: "/transactions/view-journal", dialogId: "view-journal" }, // Maybe this should be visible? But it's in Transactions
      { title: "Reconcile account", href: "/banking/reconcile", dialogId: "reconcile-account" },
      { title: "Recalculate Customers' Balances", href: "/transactions/recalculate" },
    ],
  },
  {
    title: "Sales",
    href: "#",
    icon: ShoppingCart,
    permissions: ['Sales'],
    subItems: [
      { title: "Create New Invoice", href: "/todo/create-invoice", dialogId: "create-invoice", hideForRoles: ['Auditor'] },
      { title: "Inventory", href: "/sales/inventory", dialogId: "inventory", permissions: ['Inventory'] },
    ],
  },
  {
    title: "Purchases",
    href: "#",
    icon: CreditCard,
    permissions: ['Purchases'],
    subItems: [
      { title: "Create new order", href: "#", dialogId: "create-purchase-order", hideForRoles: ['Auditor'] },
      { title: "Purchase Orders", href: "#", dialogId: "purchase-order-list" },
      { title: "Enter New Accounts Payable", href: "/purchases/enter-ap", dialogId: "enter-ap", hideForRoles: ['Auditor'] },
      { title: "Supplier", href: "#", dialogId: "supplier-list" },
    ]
  },
  {
    title: "Banking",
    href: "#",
    icon: Landmark,
    hideForRoles: ['Auditor'], // Assuming banking actions are transactional
    subItems: [
      { title: "Bank reconciliation", href: "/banking/reconcile", dialogId: "reconcile-account" },
      { title: "Account transfer", href: "/banking/transfer", dialogId: "account-transfer" },
    ]
  },
  {
    title: "Reports",
    href: "#",
    icon: FileText,
    permissions: ['Reports'],
    subItems: [
      { title: "Income Statement", href: "/reports/income-statement", dialogId: "income-statement", permissions: ['Income Statement'] },
      { title: "Balance Sheet", href: "/reports/balance-sheet", dialogId: "balance-sheet", permissions: ['Balance Sheet'] },
    ]
  },
  {
    title: "Audit",
    href: "/audit",
    icon: ClipboardList,
    permissions: ['Dashboard'], // Or specific audit permission if exists
  },
  {
    title: "Configuration",
    href: "#",
    icon: Settings,
    permissions: ['Setup'],
    subItems: [
      { title: "Chart Of Accounts", href: "/configuration/chart-of-accounts", dialogId: "chart-of-accounts" },
      { title: "Sales User", href: "/configuration/sales-users", dialogId: "sales-users" },
      { title: "User Permissions", href: "/configuration/user-permissions", dialogId: "user-permissions", permissions: ['Add/Edit user'] },
    ]
  },
  {
    title: "Setting",
    href: "#",
    icon: Settings2,
    permissions: ['Setup'],
    subItems: [
      { title: "Business Setup", href: "/setting/business-setup", dialogId: "business-setup" },
      { title: "Set Up Web Access", href: "/todo/web-access" },
      { title: "Back up data", href: "/todo/backup", dialogId: "backup-scheduler", permissions: ['Backup Database'] },
    ]
  }
];
