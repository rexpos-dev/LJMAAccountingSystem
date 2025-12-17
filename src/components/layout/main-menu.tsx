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
          <MenubarItem onClick={() => openDialog('customer-balance')}>Customer Balances</MenubarItem>
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
    </Menubar>
  );
}
