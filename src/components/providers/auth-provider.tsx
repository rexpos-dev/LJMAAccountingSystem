'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    designation: string;
    userAccess: string;
    accountType: string;
    formPermissions?: string;
    permissions: string; // JSON string
    isActive: boolean;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check for saved session on mount
        const savedUser = localStorage.getItem('auth_user');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error('Failed to parse saved user', e);
                localStorage.removeItem('auth_user');
            }
        }

        // Immediate sync with server session
        const syncSession = async () => {
            try {
                const res = await fetch('/api/auth/session');
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                    localStorage.setItem('auth_user', JSON.stringify(data.user));
                } else if (res.status === 401) {
                    // Server session is dead, clear local
                    console.log('Session expired, logging out...');
                    setUser(null);
                    localStorage.removeItem('auth_user');
                }
            } catch (err) {
                console.error('Failed to sync session:', err);
            } finally {
                setIsLoading(false);
            }
        };

        syncSession();

        // Optional: Periodic check every 5 minutes
        const interval = setInterval(syncSession, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('auth_user', JSON.stringify(userData));
        router.push('/');
    };

    const logout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
        } catch (err) {
            console.error('Logout API failed:', err);
        }
        setUser(null);
        localStorage.removeItem('auth_user');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
