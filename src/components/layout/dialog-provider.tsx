"use client";

import { createContext, useContext, useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// Import all dialog components
import CustomerListDialog from '@/components/customer/customer-list-dialog';
import { AddCustomerDialog } from '@/components/customer/add-customer-dialog';

import CustomerPaymentDialog from '@/components/customer/customer-payment-dialog';
import AddCustomerPaymentDialog from '@/components/customer/add-customer-payment-dialog';
import CustomerLoyaltyPointsDialog from '@/components/customer/customer-loyalty-points-dialog';
import LoyaltySettingsDialog from '@/components/customer/loyalty-settings-dialog';
import AddLoyaltyCardDialog from '@/components/customer/add-loyalty-card-dialog';
import { AddLoyaltySettingDialog } from '@/components/customer/add-loyalty-setting-dialog';
import AddLoyaltyPointsDialog from '@/components/customer/add-loyalty-points-dialog';
import InventoryDialog from '@/components/inventory/inventory-dialog';
import ChartOfAccountsDialog from '@/components/configuration/chart-of-accounts-dialog';
import JournalEntryDialog from '@/components/transactions/journal-entry-dialog';
import ViewJournalDialog from '@/components/transactions/view-journal-dialog';
import NewAccountDialog from '@/components/configuration/new-account-dialog';
import EditAccountDialog from '@/components/configuration/edit-account-dialog';
import DeleteAccountDialog from '@/components/configuration/delete-account-dialog';
import ReconcileAccountDialog from '@/components/banking/reconcile-account-dialog';
import AccountTransferDialog from '@/components/banking/account-transfer-dialog';
import IncomeStatementDialog from '@/components/reports/income-statement-dialog';
import BalanceSheetDialog from '@/components/reports/balance-sheet-dialog';
import EnterAccountsPayableDialog from '@/components/purchases/enter-accounts-payable-dialog';
import CreateInvoiceDialog from '@/components/todo/create-invoice-dialog';
import AddSalesUserDialog from '@/components/configuration/add-sales-user-dialog';
import EditSalesUserDialog from '@/components/configuration/edit-sales-user-dialog';
import DeleteSalesUserDialog from '@/components/configuration/delete-sales-user-dialog';
import SalesUserListDialog from '@/components/configuration/sales-user-list-dialog';
import AddUserPermissionDialog from '@/components/configuration/add-user-permission-dialog';
import EditUserPermissionDialog from '@/components/configuration/edit-user-permission-dialog';
import DeleteUserPermissionDialog from '@/components/configuration/delete-user-permission-dialog';
import UserPermissionsDialog from '@/components/configuration/user-permissions-dialog';
import BusinessSetupDialog from '@/components/configuration/business-setup-dialog';

import EnterCashSaleDialog from '@/components/transactions/enter-cash-sale-dialog';
import CreatePurchaseOrderDialog from '@/components/purchases/create-purchase-order-dialog';
import SupplierListDialog from '@/components/purchases/supplier-list-dialog';
import AddSupplierDialog from '@/components/purchases/add-supplier-dialog';

import PurchaseOrderListDialog from '@/components/purchases/purchase-order-list-dialog';
import ViewPurchaseOrderDialog from '@/components/purchases/view-purchase-order-dialog';
import InvoiceListDialog from '@/components/invoices/invoice-list-dialog';

const dialogComponents = {
  'customer-list': CustomerListDialog,
  'add-customer': AddCustomerDialog,
  'customer-payment': CustomerPaymentDialog,
  'add-customer-payment': AddCustomerPaymentDialog,
  'customer-loyalty-points': CustomerLoyaltyPointsDialog,
  'loyalty-settings': LoyaltySettingsDialog,
  'add-loyalty-card': AddLoyaltyCardDialog,
  'add-loyalty-setting': AddLoyaltySettingDialog,
  'add-loyalty-points': AddLoyaltyPointsDialog,
  'inventory': InventoryDialog,
  'chart-of-accounts': ChartOfAccountsDialog,
  'journal-entry': JournalEntryDialog,
  'view-journal': ViewJournalDialog,
  'new-account': NewAccountDialog,
  'edit-account': EditAccountDialog,
  'delete-account': DeleteAccountDialog,
  'reconcile-account': ReconcileAccountDialog,
  'account-transfer': AccountTransferDialog,
  'income-statement': IncomeStatementDialog,
  'balance-sheet': BalanceSheetDialog,
  'enter-ap': EnterAccountsPayableDialog,
  'create-invoice': CreateInvoiceDialog,
  'enter-cash-sale': EnterCashSaleDialog,
  'add-sales-user': AddSalesUserDialog,
  'edit-sales-user': EditSalesUserDialog,
  'delete-sales-user': DeleteSalesUserDialog,
  'sales-users': SalesUserListDialog,
  'add-user-permission': AddUserPermissionDialog,
  'edit-user-permission': EditUserPermissionDialog,
  'delete-user-permission': DeleteUserPermissionDialog,
  'user-permissions': UserPermissionsDialog,
  'business-setup': BusinessSetupDialog,
  'create-purchase-order': CreatePurchaseOrderDialog,
  'supplier-list': SupplierListDialog,
  'add-supplier': AddSupplierDialog,
  'purchase-order-list': PurchaseOrderListDialog,
  'view-purchase-order': ViewPurchaseOrderDialog,
  'invoice-list': InvoiceListDialog,
};

type DialogId = keyof typeof dialogComponents;

interface DialogContextType {
  openDialogs: Record<string, boolean>;
  openDialog: (id: DialogId) => void;
  closeDialog: (id: DialogId) => void;
  getDialogData: (id: DialogId) => any;
  setDialogData: (id: DialogId, data: any) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [openDialogs, setOpenDialogs] = useState<Record<string, boolean>>({});
  const [dialogData, setDialogDataState] = useState<Record<string, any>>({});

  const openDialog = useCallback((id: DialogId) => {
    console.log("openDialog called with:", id);
    setOpenDialogs(prev => ({ ...prev, [id]: true }));
  }, []);

  const closeDialog = useCallback((id: DialogId) => {
    setOpenDialogs(prev => ({ ...prev, [id]: false }));
  }, []);

  const getDialogData = useCallback((id: DialogId) => {
    return dialogData[id];
  }, [dialogData]);

  const setDialogData = useCallback((id: DialogId, data: any) => {
    setDialogDataState(prev => ({ ...prev, [id]: data }));
  }, []);

  return (
    <DialogContext.Provider
      value={{ openDialogs, openDialog, closeDialog, getDialogData, setDialogData }}
    >
      {children}
      {Object.entries(dialogComponents).map(([id, Component]) => {
        const DialogComponent = Component as any;
        return (
          <DialogComponent
            key={id}
            open={openDialogs[id] || false}
            onOpenChange={(open: boolean) => {
              if (!open) closeDialog(id as DialogId);
            }}
          />
        );
      })}
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
}
