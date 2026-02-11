"use client";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useDialog } from "./dialog-provider";

export function MainMenu() {
  const { openDialog } = useDialog();

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
          <MenubarItem>Placeholder</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Reports</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => openDialog('income-statement')}>Income Statement</MenubarItem>
          <MenubarItem onClick={() => openDialog('balance-sheet')}>Balance Sheet</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Configuration</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => openDialog('chart-of-accounts')}>Chart of Accounts</MenubarItem>
          <MenubarItem onClick={() => openDialog('sales-users')}>Sales Users</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Setting</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => openDialog('business-setup')}>Business Setup</MenubarItem>
          <MenubarItem onClick={() => openDialog('backup-scheduler')}>Back up Data</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
