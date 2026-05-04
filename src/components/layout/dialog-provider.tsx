"use client";

import { useState, useCallback } from 'react';
import { DialogId, DialogContext, useDialog, DialogIdContext, useDialogId } from './dialog-context';
export { useDialog, useDialogId };


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
import { AddProductDialog } from '@/components/inventory/add-product-dialog';
import ChartOfAccountsDialog from '@/components/configuration/chart-of-accounts-dialog';
import JournalEntryDialog from '@/components/transactions/journal-entry-dialog';
import ViewJournalDialog from '@/components/transactions/view-journal-dialog';
import NewAccountDialog from '@/components/configuration/new-account-dialog';
import EditAccountDialog from '@/components/configuration/edit-account-dialog';
import DeleteAccountDialog from '@/components/configuration/delete-account-dialog';
import ReconcileAccountDialog from '@/components/banking/reconcile-account-dialog';
import AccountTransferDialog from '@/components/banking/account-transfer-dialog';
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
import EnterPaymentDialog from '@/components/todo/enter-payment-dialog';
import IncomeStatementDialog from '@/components/reports/income-statement-dialog';
import BalanceSheetDialog from '@/components/reports/balance-sheet-dialog';
import ItemSalesReportDialog from '@/components/reports/item-sales-report-dialog';
import ItemSalesReport from '@/components/reports/item-sales-report';
import CashFlowStatementDialog from '@/components/reports/cash-flow-statement-dialog';
import CashFlowReport from '@/components/reports/cash-flow-report';
import TrialBalanceDialog from '@/components/reports/trial-balance-dialog';
import TrialBalanceReport from '@/components/reports/trial-balance-report';
import ConsolidatedReportsDialog from '@/components/reports/consolidated-reports-dialog';
import ConsolidatedReport from '@/components/reports/consolidated-report';
import IncomeStatementAnalysisDialog from '@/components/reports/income-statement-analysis-dialog';
import IncomeStatementAnalysisReport from '@/components/reports/income-statement-analysis-report';
import IncomeStatementReport from '@/components/reports/income-statement-report';
import InvoicesReportDialog from '@/components/reports/invoices-report-dialog';
import InvoicesReport from '@/components/reports/invoices-report';
import CashAdvanceReportDialog from '@/components/reports/cash-advance-report-dialog';
import CashAdvanceReport from '@/components/reports/cash-advance-report';
import SalesInvoicePaymentReportDialog from '@/components/reports/sales-invoice-payment-report-dialog';
import SalesInvoicePaymentReport from '@/components/reports/sales-invoice-payment-report';
import InventoryReportDialog from '@/components/reports/inventory-report-dialog';
import InventoryReport from '@/components/reports/inventory-report';
import SalespersonReportDialog from '@/components/reports/salesperson-report-dialog';
import SalespersonReport from '@/components/reports/salesperson-report';
import UnpaidAccountsReportDialog from '@/components/reports/unpaid-accounts-report-dialog';
import UnpaidAccountsReport from '@/components/reports/unpaid-accounts-report';
import AccountsPayableReportDialog from '@/components/reports/accounts-payable-report-dialog';
import AccountsPayableReport from '@/components/reports/accounts-payable-report';
import APPaymentsReportDialog from '@/components/reports/ap-payments-report-dialog';
import APPaymentsReport from '@/components/reports/ap-payments-report';
import ARAgingReportDialog from '@/components/reports/ar-aging-report-dialog';
import ARAgingReport from '@/components/reports/ar-aging-report';
import CustomersReportDialog from '@/components/reports/customers-report-dialog';
import CustomersReport from '@/components/reports/customers-report';
import ItemsPerCustomerReportDialog from '@/components/reports/items-per-customer-report-dialog';
import ItemsPerCustomerReport from '@/components/reports/items-per-customer-report';
import CustomerSalesReportDialog from '@/components/reports/customer-sales-report-dialog';
import CustomerSalesReport from '@/components/reports/customer-sales-report';
import OrdersReportDialog from '@/components/reports/orders-report-dialog';
import OrdersReport from '@/components/reports/orders-report';
import ReconciliationReportDialog from '@/components/reports/reconciliation-report-dialog';
import ReconciliationReport from '@/components/reports/reconciliation-report';
import AccountEnquiryReportDialog from '@/components/reports/account-enquiry-report-dialog';
import AccountEnquiryReport from '@/components/reports/account-enquiry-report';
import ChartOfAccountsReportDialog from '@/components/reports/chart-of-accounts-report-dialog';
import ChartOfAccountsReport from '@/components/reports/chart-of-accounts-report';
import MileageReportDialog from '@/components/reports/mileage-report-dialog';
import MileageReport from '@/components/reports/mileage-report';
import TaxReportDialog from '@/components/reports/tax-report-dialog';
import TaxReport from '@/components/reports/tax-report';
import BudgetReportDialog from '@/components/reports/budget-report-dialog';
import BudgetReport from '@/components/reports/budget-report';
import CustomReportDialog from '@/components/reports/custom-report-dialog';
import CustomReport from '@/components/reports/custom-report';
import PosSalesDetailDialog from '@/components/reports/pos-sales-detail-dialog';
import GeneralLedgerDialog from '@/components/reports/general-ledger-dialog';
import GeneralLedgerReport from '@/components/reports/general-ledger-report';
import { ToAuditReportDialog } from '@/components/reports/to-audit-report-dialog';
import ConsignmentOutrightReportDialog from '@/components/reports/consignment-outright-report-dialog';
import ConsignmentOutrightReport from '@/components/reports/consignment-outright-report';
import EnterCashSaleDialog from '@/components/transactions/enter-cash-sale-dialog';
import { EnterDirectPaymentsDialog } from '@/components/transactions/enter-direct-payments-dialog';
import { EnterPaymentsOfAccountsPayableDialog } from '@/components/transactions/enter-payments-of-accounts-payable-dialog';
import CreatePurchaseOrderDialog from '@/components/purchases/create-purchase-order-dialog';
import SupplierListDialog from '@/components/purchases/supplier-list-dialog';
import AddSupplierDialog from '@/components/purchases/add-supplier-dialog';
import PurchaseOrderListDialog from '@/components/purchases/purchase-order-list-dialog';
import ViewPurchaseOrderDialog from '@/components/purchases/view-purchase-order-dialog';
import InvoiceListDialog from '@/components/invoices/invoice-list-dialog';
import AccountsPayableListDialog from '@/components/purchases/accounts-payable-list-dialog';
import { EnterAccountsPayableDialog } from '@/components/purchases/enter-accounts-payable-dialog';
import CalendarModal from '@/components/dashboard/calendar-modal';
import CashFundRequestDialog from '@/components/transactions/cash-fund-request-dialog';
import BulkUploadDialog from '@/components/purchases/bulk-upload-dialog';
import PurchaseHistoryDialog from '@/components/purchases/purchase-history-dialog';
import BulkUploadAccountsDialog from '@/components/configuration/bulk-upload-accounts-dialog';
import ViewTransactionDialog from '@/components/transactions/view-transaction-dialog';
import EditTransactionDialog from '@/components/transactions/edit-transaction-dialog';
import { EnterPaymentsDialog } from '@/components/transactions/enter-payments-dialog';
import ReceiptsDepositsDialog from '@/app/banking/receipts-deposits/page';
import CustomerBalanceDialog from '@/app/customer/balance/page';
import BackupSchedulerDialog from '@/components/backup/backup-scheduler-dialog';
import BalanceSheetReportDialog from '@/components/reports/balance-sheet-report';
import BankSettingsDialog from '@/components/configuration/bank-settings-dialog';
import AddBankAccountDialog from '@/components/configuration/add-bank-account-dialog';
import EditBankAccountDialog from '@/components/configuration/edit-bank-account-dialog';
import BankHistoryDialog from '@/components/banking/bank-history-dialog';
import AddBankTransactionDialog from '@/components/banking/add-bank-transaction-dialog';
import BranchListDialog from '@/components/configuration/branch-list-dialog';
import AddBranchDialog from '@/components/configuration/add-branch-dialog';
import EmployeeDirectoryDialog from '@/components/user-management/employee-directory-dialog';
import AddEmployeeDialog from '@/components/user-management/add-employee-dialog';
import EditEmployeeDialog from '@/components/user-management/edit-employee-dialog';
import DeleteEmployeeDialog from '@/components/user-management/delete-employee-dialog';
import CustomerStatementDialog from '@/components/customer/customer-statement-dialog';
import CustomerLedgerDialog from '@/components/customer/customer-ledger-dialog';
import { DisbursementDialog } from '@/components/transactions/disbursement-dialog';
import HistoryLogsDialog from '@/components/configuration/history-logs-dialog';
import ProfitCentersDialog from '@/components/configuration/profit-centers-dialog';
import CostCentersDialog from '@/components/configuration/cost-centers-dialog';
import { AccountingFlowchartDialog } from '@/components/flowchart/accounting-flowchart-dialog';
import ReportsDialog from '@/components/reports/reports-dialog';
import DatabaseManagementDialog from '@/components/configuration/database-management-dialog';

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
  'add-product': AddProductDialog,
  'chart-of-accounts': ChartOfAccountsDialog,
  'journal-entry': JournalEntryDialog,
  'view-journal': ViewJournalDialog,
  'new-account': NewAccountDialog,
  'edit-account': EditAccountDialog,
  'delete-account': DeleteAccountDialog,
  'reconcile-account': ReconcileAccountDialog,
  'account-transfer': AccountTransferDialog,
  'add-bank-transaction': AddBankTransactionDialog,
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
  'accounts-payable': AccountsPayableListDialog,
  'enter-payments-of-accounts-payable': EnterPaymentsOfAccountsPayableDialog,
  'enter-direct-payments': EnterDirectPaymentsDialog,
  'enter-ap': EnterAccountsPayableDialog,
  'calendar-modal': CalendarModal,
  'cash-fund-request': CashFundRequestDialog,
  'bulk-upload-purchase-order': BulkUploadDialog,
  'purchase-history': PurchaseHistoryDialog,
  'bulk-upload-accounts': BulkUploadAccountsDialog,
  'enter-payment': EnterPaymentDialog,
  'view-transaction': ViewTransactionDialog,
  'edit-transaction': EditTransactionDialog,
  'enter-payments': EnterPaymentsDialog,
  'receipts-deposits': ReceiptsDepositsDialog,
  'customer-balance': CustomerBalanceDialog,
  'backup-scheduler': BackupSchedulerDialog,
  'balance-sheet-report': BalanceSheetReportDialog,
  'income-statement': IncomeStatementDialog,
  'balance-sheet': BalanceSheetDialog,
  'item-sales-report-dialog': ItemSalesReportDialog,
  'item-sales-report': ItemSalesReport,
  'cash-flow-statement-dialog': CashFlowStatementDialog,
  'cash-flow-report': CashFlowReport,
  'trial-balance-dialog': TrialBalanceDialog,
  'trial-balance-report': TrialBalanceReport,
  'consolidated-reports-dialog': ConsolidatedReportsDialog,
  'consolidated-report': ConsolidatedReport,
  'income-statement-analysis-dialog': IncomeStatementAnalysisDialog,
  'income-statement-analysis-report': IncomeStatementAnalysisReport,
  'income-statement-report': IncomeStatementReport,
  'invoices-report-dialog': InvoicesReportDialog,
  'invoices-report': InvoicesReport,
  'cash-advance-report-dialog': CashAdvanceReportDialog,
  'cash-advance-report': CashAdvanceReport,
  'orders-report-dialog': OrdersReportDialog,
  'orders-report': OrdersReport,
  'sales-invoice-payment-report-dialog': SalesInvoicePaymentReportDialog,
  'sales-invoice-payment-report': SalesInvoicePaymentReport,
  'inventory-report-dialog': InventoryReportDialog,
  'inventory-report': InventoryReport,
  'salesperson-report-dialog': SalespersonReportDialog,
  'salesperson-report': SalespersonReport,
  'unpaid-accounts-report-dialog': UnpaidAccountsReportDialog,
  'unpaid-accounts-report': UnpaidAccountsReport,
  'accounts-payable-report-dialog': AccountsPayableReportDialog,
  'accounts-payable-report': AccountsPayableReport,
  'ap-payments-report-dialog': APPaymentsReportDialog,
  'ap-payments-report': APPaymentsReport,
  'ar-aging-report-dialog': ARAgingReportDialog,
  'ar-aging-report': ARAgingReport,
  'customers-report-dialog': CustomersReportDialog,
  'customers-report': CustomersReport,
  'items-per-customer-report-dialog': ItemsPerCustomerReportDialog,
  'items-per-customer-report': ItemsPerCustomerReport,
  'customer-sales-report-dialog': CustomerSalesReportDialog,
  'customer-sales-report': CustomerSalesReport,
  'reconciliation-report-dialog': ReconciliationReportDialog,
  'reconciliation-report': ReconciliationReport,
  'account-enquiry-report-dialog': AccountEnquiryReportDialog,
  'account-enquiry-report': AccountEnquiryReport,
  'chart-of-accounts-report-dialog': ChartOfAccountsReportDialog,
  'chart-of-accounts-report': ChartOfAccountsReport,
  'mileage-report-dialog': MileageReportDialog,
  'mileage-report': MileageReport,
  'tax-report-dialog': TaxReportDialog,
  'tax-report': TaxReport,
  'budget-report-dialog': BudgetReportDialog,
  'budget-report': BudgetReport,
  'custom-report-dialog': CustomReportDialog,
  'custom-report': CustomReport,
  'pos-sales-detail': PosSalesDetailDialog,
  'general-ledger-dialog': GeneralLedgerDialog,
  'general-ledger-report': GeneralLedgerReport,
  'to-audit-report': ToAuditReportDialog,
  'consignment-outright-report-dialog': ConsignmentOutrightReportDialog,
  'consignment-outright-report': ConsignmentOutrightReport,
  'bank-settings': BankSettingsDialog,
  'add-bank-account': AddBankAccountDialog,
  'edit-bank-account': EditBankAccountDialog,
  'bank-history': BankHistoryDialog,
  'branch-list': BranchListDialog,
  'add-branch': AddBranchDialog,
  'employee-directory': EmployeeDirectoryDialog,
  'add-employee': AddEmployeeDialog,
  'edit-employee': EditEmployeeDialog,
  'delete-employee': DeleteEmployeeDialog,
  'customer-statement': CustomerStatementDialog,
  'customer-ledger': CustomerLedgerDialog,
  'disbursement-dialog': DisbursementDialog,
  'history-logs': HistoryLogsDialog,
  'profit-centers': ProfitCentersDialog,
  'cost-centers': CostCentersDialog,
  'accounting-flowchart': AccountingFlowchartDialog,
  'reports-dashboard': ReportsDialog,
  'database-management': DatabaseManagementDialog,
};

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [openDialogs, setOpenDialogs] = useState<Record<string, boolean>>({});
  const [dialogVariants, setDialogVariants] = useState<Record<string, 'default' | 'top-drawer'>>({});
  const [dialogData, setDialogDataState] = useState<Record<string, any>>({});

  const openDialog = useCallback((id: DialogId, options?: { variant?: 'default' | 'top-drawer' }) => {
    console.log("openDialog called with:", id, options);
    setOpenDialogs(prev => ({ ...prev, [id]: true }));
    if (options?.variant) {
      setDialogVariants(prev => ({ ...prev, [id]: options.variant! }));
    } else {
      setDialogVariants(prev => ({ ...prev, [id]: 'default' }));
    }
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
      value={{ openDialogs, dialogVariants, openDialog, closeDialog, getDialogData, setDialogData }}
    >
      {children}
      {Object.entries(dialogComponents).map(([id, Component]) => {
        const DialogComponent = Component as any;
        return (
          <DialogIdContext.Provider key={id} value={id as DialogId}>
            <DialogComponent
              open={openDialogs[id] || false}
              onOpenChange={(open: boolean) => {
                if (!open) closeDialog(id as DialogId);
              }}
            />
          </DialogIdContext.Provider>
        );
      })}
    </DialogContext.Provider>
  );
}
