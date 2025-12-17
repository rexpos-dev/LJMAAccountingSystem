'use client';

import React, { useMemo, type ReactNode, useEffect } from 'react';
import { FirebaseProvider, useAuth, useFirestore, useUser } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';
import { seedChartOfAccounts } from '@/lib/seed-db';
import { seedImportedTransactions } from '@/lib/seed-imported-transactions';
import { initiateAnonymousSignIn } from './non-blocking-login';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

function FirebaseSeeder() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (firestore) {
      seedImportedTransactions(firestore); // Seed imported transactions globally
      if (user && !isUserLoading) {
        seedChartOfAccounts(firestore, user.uid);
      }
    }
  }, [firestore, user, isUserLoading]);

  return null;
}

function AuthManager() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    // If auth is initialized, user is not loading, and there's no user, sign in.
    if (auth && !isUserLoading && !user) {
      initiateAnonymousSignIn(auth);
    }
  }, [auth, user, isUserLoading]);

  return null; // This component does not render anything.
}


export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const firebaseServices = useMemo(() => {
    // Initialize Firebase on the client side, once per component mount.
    return initializeFirebase();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      <AuthManager />
      <FirebaseSeeder />
      {children}
    </FirebaseProvider>
  );
}
