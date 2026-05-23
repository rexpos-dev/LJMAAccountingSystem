# LJMA Accounting System

An integrated, end-to-end accounting and financial management platform designed to handle POS data, Accounts Payable (AP), Accounts Receivable (AR), banking transactions, and robust auditing. 

## 🎯 Purpose of the System

The LJMA Accounting System serves as the central source of truth for all financial operations. It is built to ensure data integrity, prevent fraud, and provide real-time financial reporting. The system achieves this by automating the accounting processes from the moment a transaction is initiated (e.g., via POS or manual entry) through its review and final reconciliation.

### Key Modules:
- **Banking Module**: Manages bank accounts, bank transactions (transfers, deposits, adjustments), and reconciliation.
- **Accounts Payable / Receivable (AP/AR)**: Tracks money owed by customers and money owed to vendors/suppliers.
- **Point of Sale (POS) Integration**: Captures daily sales data and syncs it securely to the general ledger.
- **Audit Workflow**: An internal control system to review and approve transactions before they affect the general ledger.
- **Reporting & Dashboard**: Visualizes financial health, cash flow, and key metrics.

## 🔄 System Flow

The system strongly enforces a Maker-Checker principle to ensure financial accuracy. The general flow for financial data is as follows:

1. **Transaction Initiation (Maker)**:
   - Transactions flow in via POS sync, AP/AR entries, or manual bank transaction logging.
   - All newly recorded financial data begins in a **Draft** or **Pending Audit** state.
   
2. **Audit Workflow (Checker)**:
   - Users with `AUDIT` or `AUDITOR` permissions are assigned to review pending transactions.
   - The auditor reviews the transaction details (reference number, amounts, source).
   - The auditor can either **Approve (Post)** the transaction or **Reject (Return to Draft)** it with notes.
   
3. **Journal Posting Engine**:
   - Once approved, the transaction is processed by the journal posting engine.
   - Immutable journal entries are created in the general ledger.
   - Appropriate accounts (e.g., Bank, AP, Expenses) are debited and credited.
   
4. **Reconciliation & Reporting**:
   - Posted transactions are available for bank reconciliation.
   - Live dashboards immediately reflect updated balances, daily cash flow, and financial health.

## � API Integration for POS

The system is designed to securely receive sales, tax, and payment data from external Point of Sale (POS) terminals via API integration.

### Sync Process:
1. **Endpoint Access**: The external POS pushes End-of-Day (EOD) or batch transaction data to the system's designated POS integration API endpoint.
2. **Payload Structure**: The API expects a JSON payload detailing gross sales, net sales, tax collected, and grouped payment methods (Cash, Card, GCash, etc.).
3. **Data Validation**: The backend validates the integrity of the data, ensuring that total payments match total sales (accounting for discounts/returns).
4. **Draft Creation**: Upon successful validation, the system automatically translates the POS data into **Draft** Journal Entries or Pending Bank Deposit logs.
5. **Audit Handoff**: The newly ingested POS data is queued in the Audit Workflow, where an Auditor can cross-verify the data against physical receipts before officially **Posting** the day's sales to the General Ledger.

This API-first architecture ensures that any data entering from an external POS adheres to the exact same strict Maker-Checker auditing principles as manual entries.

## �🚀 How to Use & Extend the System for Future Work


This project is built using **Next.js**, **React**, and **Firebase**. 

### Getting Started Checklist
1. Install dependencies using `npm install`.
2. Start the development server with `npm run dev`.
3. Open `http://localhost:3000` to view the application.

### Project Structure Guidelines
- `/src/app/`: Contains the Next.js App Router pages and layouts. Adding a new module or page should start here.
- `/src/components/`: Reusable UI components (e.g., AuditCards, Dialogs, Charts). Keep presentation components separated from complex business logic.
- `/src/lib/`: Core business logic, Firebase database interactions, and utility functions (e.g., `database.ts`).

### Guidelines for Future Development
When adding new features or modifying existing workflows, please adhere to the following principles:

1. **Strict Auditing**: Any new feature that modifies financial balances *must* integrate with the Audit Workflow. Do not bypass the Draft -> Audit -> Post flow.
2. **Data Integrity**: Ensure database transactions or batch writes are used when logging related journal entries to prevent partial updates.
3. **Consistent UI/UX**: Follow the established premium design system. Dialogs, filter components, and dashboards should maintain a uniform CSS/style and responsive behavior across the application. New charts should match the styling of existing financial health components.
4. **Permissions**: Always verify the active user's role before granting access to sensitive actions (e.g., Approving transactions). Rely on the existing user permission data structure.
