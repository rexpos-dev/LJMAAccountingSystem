import type { Metadata } from 'next';
import React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { DialogProvider } from '@/components/layout/dialog-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { EnterPaymentsDialog } from '@/components/transactions/enter-payments-dialog';
import { EnterPaymentsOfAccountsPayableDialog } from '@/components/transactions/enter-payments-of-accounts-payable-dialog';
import { EnterDirectPaymentsDialog } from '@/components/transactions/enter-direct-payments-dialog';
import AddUserPermissionDialog from '@/components/configuration/add-user-permission-dialog';
import EditUserPermissionDialog from '@/components/configuration/edit-user-permission-dialog';
import DeleteUserPermissionDialog from '@/components/configuration/delete-user-permission-dialog';
import UserPermissionsDialog from '@/components/configuration/user-permissions-dialog';

export const metadata: Metadata = {
  title: 'LJMA FinancePro',
  description: 'Accounting and Financial Management System for THE LJMA MERCHANDISE CORPORATION',
};

import { AppShellWrapper } from '@/components/layout/app-shell-wrapper';

import { AuthProvider } from '@/components/providers/auth-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';

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
      <body className="font-body antialiased" suppressHydrationWarning>
        <ThemeProvider defaultTheme="dark" storageKey="ljma-ui-theme">
          <AuthProvider>
            <QueryProvider>
              <DialogProvider>
                <AppShellWrapper>
                  {children}
                </AppShellWrapper>
                <EnterPaymentsDialog />
                <EnterPaymentsOfAccountsPayableDialog />
                <EnterDirectPaymentsDialog />
              </DialogProvider>
            </QueryProvider>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
