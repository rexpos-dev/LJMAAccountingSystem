
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  SidebarContent,
  SidebarFooter,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { navItems, type NavItem } from "@/lib/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown, Bell, PanelsTopLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserNav } from "./user-nav";
import { NotificationBell } from "./notification-bell";
import { EmailButton } from "./email-button";
import { Breadcrumbs } from "./breadcrumbs";
import { ThemeToggle } from "./theme-toggle";

// ... (keep surrounding imports if range allows, but aiming for cleaner replacement)
// Actually, I can't modify imports easily with a single chunk if they are far apart.
// I'll do this in two steps or use MultiReplace if imports are far.
// Let's replace the usage first.

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useDialog } from "./dialog-provider";
import dynamic from 'next/dynamic';
import NewAccountDialog from "../configuration/new-account-dialog";
import EditTransactionDialog from "../transactions/edit-transaction-dialog";
import ViewTransactionDialog from "../transactions/view-transaction-dialog";
import { AddCustomerDialog } from "../customer/add-customer-dialog";
import { AddLoyaltySettingDialog } from "../customer/add-loyalty-setting-dialog";
import { Account } from "@/types/account";
import { Transaction } from "@/types/transaction";
import AddPointsDialog from "../customer/add-points-dialog";
import { useBusinessProfile } from "@/hooks/use-business-profile";

// Dynamically import pages (server components) on the client to avoid client->server import errors
const ChartOfAccountsPage = dynamic(() => import('@/app/configuration/chart-of-accounts/page').then(m => m.default), { ssr: false });
const EnterApPage = dynamic(() => import('@/app/purchases/enter-ap/page').then(m => m.default), { ssr: false });
const ReconcileAccountPage = dynamic(() => import('@/app/banking/reconcile/page').then(m => m.default), { ssr: false });
const ReceiptsDepositsPage = dynamic(() => import('@/app/banking/receipts-deposits/page').then(m => m.default), { ssr: false });
const AccountTransferPage = dynamic(() => import('@/app/banking/transfer/page').then(m => m.default), { ssr: false });
const ViewJournalPage = dynamic(() => import('@/app/transactions/view-journal/page').then(m => m.default), { ssr: false });
const JournalEntryPage = dynamic(() => import('@/app/transactions/journal-entry/page').then(m => m.default), { ssr: false });
const IncomeStatementPage = dynamic(() => import('@/app/reports/income-statement/page').then(m => m.default), { ssr: false });
const BalanceSheetPage = dynamic(() => import('@/app/reports/balance-sheet/page').then(m => m.default), { ssr: false });
const BalanceSheetReport = dynamic(() => import('../reports/balance-sheet-report').then(m => m.default), { ssr: false });
const CustomerListPage = dynamic(() => import('@/app/customer/list/page').then(m => m.default), { ssr: false });
const CustomerBalancePage = dynamic(() => import('@/app/customer/balance/page').then(m => m.default), { ssr: false });
const CustomerPaymentPage = dynamic(() => import('@/app/customer/payment/page').then(m => m.default), { ssr: false });
const CustomerLoyaltyPointsPage = dynamic(() => import('@/app/customer/loyalty-points/page').then(m => m.default), { ssr: false });
const LoyaltySettingsPage = dynamic(() => import('@/app/customer/loyalty-settings/page').then(m => m.default), { ssr: false });
import { AddLoyaltyCardDialog } from "../customer/add-loyalty-card-dialog";
import InventoryDialog from "../inventory/inventory-dialog";
import { AddProductDialog } from "../inventory/add-product-dialog";
import BackupSchedulerDialog from "../backup/backup-scheduler-dialog";

import { useAuth } from "../providers/auth-provider";

function SidebarNav() {
  const pathname = usePathname();
  const { openDialog } = useDialog();
  const { user } = useAuth();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    dialogId?: string
  ) => {
    if (dialogId) {
      e.preventDefault();
      openDialog(dialogId as any);
    }
  };

  const hasAccess = (item: { hideForRoles?: string[], permissions?: string[], accountType?: string, roles?: string[] }) => {
    if (!user) return false;

    // Super Admin has access to everything
    if (user.accountType === 'Super Admin' || user.accountType === 'Admin') return true;

    // Check role restrictions (hideForRoles)
    if (item.hideForRoles && item.hideForRoles.includes(user.accountType)) {
      return false;
    }

    // Check allowed roles (roles)
    if (item.roles && !item.roles.includes(user.accountType)) {
      return false;
    }

    // Check individual permissions
    if (item.permissions) {
      let userPermissions: string[] = [];
      try {
        userPermissions = typeof user.permissions === 'string'
          ? JSON.parse(user.permissions)
          : user.permissions;
      } catch (e) {
        console.error('Failed to parse permissions', e);
        userPermissions = [];
      }

      const hasPermission = item.permissions.some(p => userPermissions.includes(p));
      if (!hasPermission) return false;
    }

    return true;
  };

  const renderNavItem = (item: NavItem) => {
    if (!isMounted) return null;
    if (!hasAccess(item)) return null;

    // Filter sub-items if they exist
    const visibleSubItems = item.subItems?.filter(hasAccess);

    // If item has subItems but none are visible, and the item itself doesn't have a direct href (is just a grouper), hide it
    // But if it has a direct href (like Dashboard), show it without subitems? 
    // Usually groupers have href="#"
    if (item.subItems && (!visibleSubItems || visibleSubItems.length === 0) && item.href === '#') {
      return null;
    }

    const isActive = item.subItems
      ? item.subItems.some((sub) => pathname.startsWith(sub.href))
      : pathname.startsWith(item.href);

    if (item.subItems && visibleSubItems && visibleSubItems.length > 0) {
      return (
        <Collapsible key={item.title} defaultOpen={isActive} className="w-full">
          <SidebarMenuItem className="w-full">
            <CollapsibleTrigger asChild>
              <div className="relative flex w-full items-center">
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className="w-full justify-start"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </div>
                    <ChevronsUpDown className="h-4 w-4" />
                  </div>
                </SidebarMenuButton>
              </div>
            </CollapsibleTrigger>
          </SidebarMenuItem>
          <CollapsibleContent>
            <SidebarMenuSub>
              {visibleSubItems.map((subItem) => (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={pathname === subItem.href}
                    onClick={(e: any) =>
                      handleNavClick(e, subItem.href, subItem.dialogId as any)
                    }
                  >
                    <Link href={subItem.href}>{subItem.title}</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      );
    }

    return (
      <SidebarMenuItem key={item.title}>
        <Link
          href={item.href}
          passHref
          onClick={(e) => handleNavClick(e, item.href, item.dialogId)}
        >
          <SidebarMenuButton
            isActive={isActive}
            className="w-full justify-start"
          >
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
            {item.label && (
              <span className="ml-auto bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded-full">
                {item.label}
              </span>
            )}
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    );
  };

  return <SidebarMenu>{navItems.map((item) => renderNavItem(item))}</SidebarMenu>;
}


export function AppShell({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = React.useState(false);
  const [selectedAccount, setSelectedAccount] = React.useState<Account | null>(null);
  const [selectedTransaction, setSelectedTransaction] = React.useState<Transaction | null>(null);
  const [reportDate, setReportDate] = React.useState<Date | null>(null);
  const { openDialogs, openDialog, closeDialog } = useDialog();
  const { profile, isLoading } = useBusinessProfile();

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const handleAccountSelect = (account: Account | null) => {
    setSelectedAccount(account);
  };

  const handleTransactionSelect = (transaction: Transaction | null) => {
    setSelectedTransaction(transaction);
  };

  const handleShowReport = (date: Date) => {
    setReportDate(date);
    openDialog('balance-sheet-report' as any);
  }


  return (
    <>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 p-2 pr-4">
              <PanelsTopLeft className="w-8 h-8 text-primary" />
              {isLoading ? (
                <Skeleton className="h-7 w-40" />
              ) : (
                <h1 className="text-xl font-bold font-headline truncate max-w-[200px]" title={profile?.businessName || "LJMA FinancePro"}>
                  {profile?.businessName || "LJMA FinancePro"}
                </h1>
              )}
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarNav />
          </SidebarContent>
          <SidebarFooter>{/* Footer content if any */}</SidebarFooter>
        </Sidebar >
        <SidebarInset className="flex flex-col">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <SidebarTrigger className="md:hidden" />
            <Breadcrumbs />
            <div className="flex items-center gap-2 ml-auto">
              <ThemeToggle />
              <EmailButton />
              <NotificationBell />
              <UserNav />
            </div>
          </header>
          <main>
            {React.Children.map(children, (child, index) => {
              if (React.isValidElement(child)) {
                let additionalProps = {};
                if (child.type === ChartOfAccountsPage) {
                  additionalProps = {
                    onAccountSelect: handleAccountSelect,
                    selectedAccount: selectedAccount
                  };
                } else if (child.type === ViewJournalPage) {
                  additionalProps = { onTransactionSelect: handleTransactionSelect };
                } else if (child.type === BalanceSheetPage) {
                  additionalProps = { onViewReport: handleShowReport };
                }
                return React.cloneElement(child, { key: `child-${index}`, ...additionalProps });
              }
              return <div key={`child-${index}`}>{child}</div>;
            })}

            {openDialogs['new-account'] && <NewAccountDialog />}
            {openDialogs['enter-ap'] && <EnterApPage />}
            {openDialogs['receipts-deposits'] && <ReceiptsDepositsPage />}

            {openDialogs['journal-entry'] && <JournalEntryPage />}
            {openDialogs['income-statement'] && <IncomeStatementPage />}
            {openDialogs['balance-sheet'] && <BalanceSheetPage onViewReport={handleShowReport} />}
            {openDialogs['balance-sheet-report'] && reportDate && <BalanceSheetReport reportDate={reportDate} />}
            {openDialogs['edit-transaction'] && <EditTransactionDialog transaction={selectedTransaction} />}
            {openDialogs['view-transaction'] && <ViewTransactionDialog transaction={selectedTransaction} />}
            {openDialogs['customer-list'] && <CustomerListPage />}
            {openDialogs['customer-balance'] && <CustomerBalancePage />}
            {/* CustomerPaymentPage removed as it is now handled by DialogProvider as CustomerPaymentDialog (Form) and CustomerPaymentsListDialog */}
            {openDialogs['customer-loyalty-points'] && <CustomerLoyaltyPointsPage />}
            {openDialogs['add-customer'] && <AddCustomerDialog />}
            {openDialogs['loyalty-settings'] && <LoyaltySettingsPage />}
            {openDialogs['add-loyalty-setting'] && <AddLoyaltySettingDialog />}
            {openDialogs['add-loyalty-card'] && <AddLoyaltyCardDialog />}
            {openDialogs['add-loyalty-points'] && <AddPointsDialog />}
            {openDialogs['inventory'] && <InventoryDialog />}
            {openDialogs['add-product'] && <AddProductDialog />}
            {openDialogs['backup-scheduler'] && <BackupSchedulerDialog />}
          </main>
        </SidebarInset>
      </SidebarProvider >
    </>
  );
}
