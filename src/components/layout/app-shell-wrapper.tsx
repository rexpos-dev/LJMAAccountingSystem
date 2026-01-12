'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';
import { AppShell } from './app-shell';

export function AppShellWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const isLoginPage = pathname === '/login';

    React.useEffect(() => {
        if (!isLoading && !user && !isLoginPage) {
            router.push('/login');
        }
    }, [user, isLoading, isLoginPage, router]);

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    if (isLoginPage) {
        return <main>{children}</main>;
    }

    if (!user) {
        return null;
    }

    return (
        <AppShell>
            {React.Children.map(children, (child, index) => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child, { key: `page-${index}` });
                }
                return <div key={`page-${index}`}>{child}</div>;
            })}
        </AppShell>
    );
}
