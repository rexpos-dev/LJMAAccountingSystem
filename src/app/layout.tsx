import type { Metadata } from 'next';
import React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { DialogProvider } from '@/components/layout/dialog-provider';
import { EnterPaymentsDialog } from '@/components/transactions/enter-payments-dialog';
import { EnterPaymentsOfAccountsPayableDialog } from '@/components/transactions/enter-payments-of-accounts-payable-dialog';
import { EnterDirectPaymentsDialog } from '@/components/transactions/enter-direct-payments-dialog';

export const metadata: Metadata = {
  title: 'LJMA FinancePro',
  description: 'Accounting and Financial Management System for THE LJMA MERCHANDISE CORPORATION',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <DialogProvider>
          <AppShell>
            {React.Children.map(children, (child, index) => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child, { key: `page-${index}` });
              }
              return <div key={`page-${index}`}>{child}</div>;
            })}
          </AppShell>
          <EnterPaymentsDialog />
          <EnterPaymentsOfAccountsPayableDialog />
          <EnterDirectPaymentsDialog />
        </DialogProvider>
        <Toaster />
      </body>
    </html>
  );
}
