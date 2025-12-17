
'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

interface DialogContextType {
  openDialogs: { [key: string]: boolean };
  dialogData: { [key: string]: any };
  openDialog: (id: string, data?: any) => void;
  closeDialog: (id: string) => void;
  getDialogData: (id: string) => any;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [openDialogs, setOpenDialogs] = useState<{ [key: string]: boolean }>({});
  const [dialogData, setDialogData] = useState<{ [key: string]: any }>({});

  const openDialog = useCallback((id: string, data?: any) => {
    setOpenDialogs((prev) => ({ ...prev, [id]: true }));
    if (data !== undefined) {
      setDialogData((prev) => ({ ...prev, [id]: data }));
    }
  }, []);

  const closeDialog = useCallback((id: string) => {
    setOpenDialogs((prev) => ({ ...prev, [id]: false }));
    setDialogData((prev) => {
      const newData = { ...prev };
      delete newData[id];
      return newData;
    });
  }, []);

  const getDialogData = useCallback((id: string) => {
    return dialogData[id];
  }, [dialogData]);

  const value = useMemo(() => ({
    openDialogs,
    dialogData,
    openDialog,
    closeDialog,
    getDialogData
  }), [openDialogs, dialogData, openDialog, closeDialog, getDialogData]);

  return (
    <DialogContext.Provider value={value}>
      {children}
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
