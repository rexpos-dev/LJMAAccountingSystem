"use client";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useDialog } from "./dialog-provider";
import { useNotifications } from "@/hooks/use-notifications";

export function MainMenu() {
  const { openDialog } = useDialog();
  const { notifications } = useNotifications();

  const getCount = (type: string | string[]) => {
    if (!notifications) return 0;
    const types = Array.isArray(type) ? type : [type];
    return notifications.filter(n => types.includes(n.type)).length;
  };

  const requestCount = getCount('REQUEST_VERIFICATION');
  const auditCount = getCount(['AuditAssignment', 'AuditComment']);
  const accessCount = getCount('ACCESS_REQUEST');

  return (
    <Menubar className="rounded-none border-b border-none px-2 lg:px-4">
      <MenubarMenu>
        <MenubarTrigger>Accounting Flowchart</MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Customer</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => openDialog('customer-list')}>Customer List</MenubarItem>
          <MenubarItem onClick={() => openDialog('customer-balance' as any)}>Customer Balances</MenubarItem>
          <MenubarItem onClick={() => openDialog('customer-payment')}>Customer Payment</MenubarItem>
          <MenubarItem onClick={() => openDialog('customer-loyalty-points')}>Customer Loyalty Points</MenubarItem>
          <MenubarItem onClick={() => openDialog('loyalty-settings')}>Loyalty Points Settings</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Sales</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => openDialog('inventory')}>Inventory</MenubarItem>
          <MenubarItem onClick={() => openDialog('pos-sales-detail')}>POS Sales Detail</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="relative flex items-center">
          Transactions
          {requestCount > 0 && (
            <span className="ml-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
              {requestCount}
            </span>
          )}
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => openDialog('receipts-deposits')}>Received a Payment</MenubarItem>
          <MenubarItem onClick={() => openDialog('journal-entry')}>Manual journal entry</MenubarItem>
          <MenubarItem onClick={() => openDialog('view-journal')} className="flex items-center justify-between">
            View journal
            {requestCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                {requestCount}
              </span>
            )}
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="relative flex items-center">
          Reports
          {auditCount > 0 && (
            <span className="ml-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
              {auditCount}
            </span>
          )}
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => openDialog('to-audit-report')} className="flex items-center justify-between">
            To Audit Items
            {auditCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                {auditCount}
              </span>
            )}
          </MenubarItem>
          <MenubarItem onClick={() => openDialog('general-ledger-dialog')}>General Ledger</MenubarItem>
          <MenubarItem onClick={() => openDialog('income-statement')}>Income Statement</MenubarItem>
          <MenubarItem onClick={() => openDialog('balance-sheet')}>Balance Sheet</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="relative flex items-center">
          Configuration
          {accessCount > 0 && (
            <span className="ml-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
              {accessCount}
            </span>
          )}
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => openDialog('chart-of-accounts')}>Chart of Accounts</MenubarItem>
          <MenubarItem onClick={() => openDialog('profit-centers')}>Profit Centers</MenubarItem>
          <MenubarItem onClick={() => openDialog('cost-centers')}>Cost Centers</MenubarItem>
          <MenubarItem onClick={() => openDialog('sales-users')} className="flex items-center justify-between">
            Sales Users
            {accessCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                {accessCount}
              </span>
            )}
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Setting</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => openDialog('business-setup')}>Business Setup</MenubarItem>
          <MenubarItem onClick={() => openDialog('bank-settings' as any)}>Bank Settings</MenubarItem>
          <MenubarItem onClick={() => openDialog('backup-scheduler')}>Back up Data</MenubarItem>
          <MenubarItem onClick={() => openDialog('branch-list')}>Branch</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
