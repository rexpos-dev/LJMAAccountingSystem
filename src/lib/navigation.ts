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
  UserCog,
  ClipboardList,
  FilePlus,
  Database,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  label?: string;
  dialogId?: string;
  group?: string;
  subItems?: Omit<NavItem, 'icon' | 'subItems' | 'label' | 'group'>[];
  permissions?: string[];
  hideForRoles?: string[];
  roles?: string[];
}

export const navItems: NavItem[] = [
  // ── Overview ─────────────────────────────────────────────
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    group: "Overview",
    permissions: ['Dashboard'],
  },
  {
    title: "Accounting Flowchart",
    href: "#",
    icon: Network,
    group: "Overview",
    permissions: ['Dashboard'],
    dialogId: "accounting-flowchart"
  },
  {
    title: "Audit",
    href: "/audit",
    icon: ClipboardList,
    group: "Overview",
    permissions: ['Dashboard'],
  },

  // ── Operations ────────────────────────────────────────────
  {
    title: "To-Do",
    href: "#",
    icon: ListChecks,
    group: "Operations",
    hideForRoles: ['Auditor'],
    subItems: [
      { title: "Create first invoice", href: "/todo/create-invoice", dialogId: "create-invoice" },
      { title: "Enter your first payment", href: "/todo/enter-payment", dialogId: "enter-payments" },
      { title: "Requests", href: "/requests" },
    ],
  },
  {
    title: "Transactions",
    href: "#",
    icon: ArrowRightLeft,
    group: "Operations",
    hideForRoles: ['Auditor'],
    subItems: [
      { title: "Make a payment", href: "#", dialogId: "enter-payments" },
      { title: "Received a Payment", href: "/banking/receipts-deposits", dialogId: "receipts-deposits" },
      { title: "Manual journal entry", href: "/transactions/journal-entry", dialogId: "journal-entry" },
      { title: "View journal", href: "/transactions/view-journal", dialogId: "view-journal" },
      { title: "Reconcile account", href: "/banking/reconcile", dialogId: "reconcile-account" },
    ],
  },

  // ── Sales & Purchases ─────────────────────────────────────
  {
    title: "Customer",
    href: "#",
    icon: Users,
    group: "Sales & Purchases",
    permissions: ['Customers'],
    subItems: [
      { title: "Customer List", href: "/customer/list", dialogId: "customer-list" },
      { title: "Customer Balance", href: "/customer/balance", dialogId: "customer-balance", permissions: ['Customer Balances'] },
      { title: "Customer Payment", href: "/customer/payment", dialogId: "customer-payment", permissions: ['Customer Payment'], hideForRoles: ['Auditor'] },
      { title: "Customer Loyalty Points", href: "/customer/loyalty-points", dialogId: "customer-loyalty-points", permissions: ['Customer Loyalty Points'] },
    ],
  },
  {
    title: "Sales",
    href: "#",
    icon: ShoppingCart,
    group: "Sales & Purchases",
    permissions: ['Sales'],
    subItems: [
      { title: "Invoices", href: "#", dialogId: "invoice-list" },
      { title: "Create New Invoice", href: "/todo/create-invoice", dialogId: "create-invoice", hideForRoles: ['Auditor'] },
      { title: "POS Sales Detail", href: "#", dialogId: "pos-sales-detail", hideForRoles: ['Auditor'] },
      { title: "Inventory", href: "/sales/inventory", dialogId: "inventory", permissions: ['Inventory'] },
    ],
  },
  {
    title: "Purchases",
    href: "#",
    icon: CreditCard,
    group: "Sales & Purchases",
    permissions: ['Purchases'],
    subItems: [
      { title: "Create new order", href: "#", dialogId: "create-purchase-order", hideForRoles: ['Auditor'] },
      { title: "Purchase Orders", href: "#", dialogId: "purchase-order-list" },
      { title: "Enter New Accounts Payable", href: "/purchases/enter-ap", dialogId: "enter-ap", hideForRoles: ['Auditor'] },
      { title: "Supplier", href: "#", dialogId: "supplier-list" },
    ]
  },

  // ── Finance ───────────────────────────────────────────────
  {
    title: "Banking",
    href: "#",
    icon: Landmark,
    group: "Finance",
    hideForRoles: ['Auditor'],
    subItems: [
      { title: "Bank Accounts", href: "/setting/bank-settings", dialogId: "bank-settings" },
      { title: "Bank Transactions", href: "/banking/history", dialogId: "bank-history" },
      { title: "Transfers", href: "/banking/transfer", dialogId: "account-transfer" },
      { title: "Reconciliation", href: "/banking/reconcile", dialogId: "reconcile-account" },
      { title: "Receipts & Deposits", href: "/banking/receipts-deposits", dialogId: "receipts-deposits" },
    ]
  },
  {
    title: "Reports",
    href: "#",
    icon: FileText,
    group: "Finance",
    permissions: ['Reports'],
    roles: ['Super Admin', 'Administrator'],
    dialogId: "reports-dashboard"
  },

  // ── Management ────────────────────────────────────────────
  {
    title: "User Management",
    href: "#",
    icon: UserCog,
    group: "Management",
    permissions: ['Setup'],
    subItems: [
      { title: "Sales User", href: "/configuration/sales-users", dialogId: "sales-users" },
      { title: "User Permissions", href: "/configuration/user-permissions", dialogId: "user-permissions", permissions: ['Add/Edit user'] },
      { title: "Employee Directory", href: "/user-management/employee-directory", dialogId: "employee-directory" },
    ]
  },
  {
    title: "Configuration",
    href: "#",
    icon: Settings,
    group: "Management",
    permissions: ['Setup'],
    subItems: [
      { title: "Chart Of Accounts", href: "/configuration/chart-of-accounts", dialogId: "chart-of-accounts" },
    ]
  },
  {
    title: "Setting",
    href: "#",
    icon: Settings2,
    group: "Management",
    permissions: ['Setup'],
    subItems: [
      { title: "Business Setup", href: "/setting/business-setup", dialogId: "business-setup" },
      { title: "Set Up Web Access", href: "/todo/web-access" },
      { title: "Database Management", href: "#", dialogId: "database-management", permissions: ['Backup Database'], roles: ['Super Admin', 'Administrator'] },
      { title: "Branch", href: "/setting/branches", dialogId: "branch-list" },
      { title: "History Logs", href: "/setting/history-logs", dialogId: "history-logs", roles: ['Super Admin', 'Admin', 'Administrator'] },
    ]
  }
];
