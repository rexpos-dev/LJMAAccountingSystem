import { prisma } from './prisma'

// Account operations
export const getAccounts = async () => {
  try {
    const accounts = await prisma.$queryRaw`
            SELECT * FROM chart_of_account 
            ORDER BY account_no ASC
        `;
    return Array.isArray(accounts) ? accounts : [];
  } catch (error) {
    console.error('Error in getAccounts:', error);
    return [];
  }
}

export const getBankAccountsFromCOA = async () => {
  try {
    const accounts = await prisma.$queryRaw`
            SELECT * FROM chart_of_account 
            WHERE bank = 'Yes'
        `;
    return Array.isArray(accounts) ? accounts : [];
  } catch (error) {
    console.error('Error in getBankAccountsFromCOA:', error);
    return [];
  }
}

// Dedicated Bank Account operations
export const getAllBankAccounts = async (onlyApproved = false) => {
  try {
    const where: any = {};
    if (onlyApproved) {
      where.audit_status = 'DONE';
    }

    return await prisma.bankAccount.findMany({
      where,
      include: {
        gl_account: true
      },
      orderBy: {
        bank_code: 'asc'
      }
    });
  } catch (error) {
    console.error('Error in getAllBankAccounts:', error);
    return [];
  }
}

export const getBankTransactionsHistory = async (params: {
  bankAccountId?: string;
  status?: string;
  type?: string;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}) => {
  try {
    const { bankAccountId, status, type, startDate, endDate, search } = params;
    const where: any = {};
    if (bankAccountId) where.bankAccountId = bankAccountId;
    if (status && status !== 'ALL') where.status = status;
    if (type && type !== 'ALL') where.type = type;

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }

    if (search) {
      where.OR = [
        { reference: { contains: search, mode: 'insensitive' } },
        { particulars: { contains: search, mode: 'insensitive' } },
        { bankAccount: { account_name: { contains: search, mode: 'insensitive' } } },
        { bankAccount: { bank_name: { contains: search, mode: 'insensitive' } } }
      ];
    }

    return await prisma.bankTransaction.findMany({
      where,
      include: {
        bankAccount: {
          include: {
            gl_account: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });
  } catch (error) {
    console.error('Error in getBankTransactionsHistory:', error);
    return [];
  }
}

export const createBankAccount = async (data: any) => {
  const { user, ...bankAccountData } = data;
  const account = await prisma.bankAccount.create({
    data: bankAccountData,
    include: {
      gl_account: true
    }
  });

  const refNo = Math.floor(Date.now() / 1000).toString();

  // Create Audit Log for Phase 1 Registration
  await prisma.auditLog.create({
    data: {
      actionType: 'Bank Registration',
      transactionId: refNo,
      bankName: account.bank_name,
      initiatedBy: user || 'System',
      amount: bankAccountData.opening_balance || 0,
      details: `New bank account registration for ${account.bank_name} - ${account.account_name} (${account.account_number}). Needs audit before becoming active.`,
      status: 'To Audit'
    }
  });

  return account;
}

export const updateBankAccount = async (id: string, data: any) => {
  return await prisma.bankAccount.update({
    where: { id },
    data,
    include: {
      gl_account: true
    }
  });
}

export const deleteBankAccount = async (id: string) => {
  return await prisma.bankAccount.delete({
    where: { id }
  });
}

// Bank Transaction details
export const getBankTransactions = async (accountNumber: string) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        accountNumber: accountNumber
      },
      orderBy: { date: 'desc' }
    });
    return transactions;
  } catch (error) {
    console.error('Error in getBankTransactions:', error);
    return [];
  }
}

export const recordBankTransfer = async (data: {
  fromBankAccountId: string;
  toBankAccountId: string;
  amount: number;
  date: Date;
  reference?: string;
  memo?: string;
  user: string;
}) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Create Outgoing Bank Transaction (DRAFT/TO_AUDIT)
    const withdrawal = await tx.bankTransaction.create({
      data: {
        bankAccountId: data.fromBankAccountId,
        type: 'TRANSFER_OUT',
        status: 'TO_AUDIT',
        amount: data.amount,
        balanceAfter: 0, // Will be updated upon posting
        reference: data.reference,
        particulars: data.memo || `Transfer to ${data.toBankAccountId}`,
        sourceType: 'TRANSFER',
        date: data.date
      }
    });

    // 2. Create Incoming Bank Transaction
    const deposit = await tx.bankTransaction.create({
      data: {
        bankAccountId: data.toBankAccountId,
        type: 'TRANSFER_IN',
        status: 'TO_AUDIT',
        amount: data.amount,
        balanceAfter: 0,
        reference: data.reference,
        particulars: data.memo || `Transfer from ${data.fromBankAccountId}`,
        sourceType: 'TRANSFER',
        date: data.date
      }
    });

    // 3. Create Audit Logs
    const fromBank = await tx.bankAccount.findUnique({ where: { id: data.fromBankAccountId } });
    const toBank = await tx.bankAccount.findUnique({ where: { id: data.toBankAccountId } });

    await tx.auditLog.create({
      data: {
        actionType: 'Bank Transfer Out',
        transactionId: withdrawal.id,
        bankName: fromBank?.bank_name || 'Bank',
        initiatedBy: data.user,
        amount: data.amount,
        details: data.memo || `Bank Transfer Request: Outgoing`,
        status: 'To Audit'
      }
    });

    await tx.auditLog.create({
      data: {
        actionType: 'Bank Transfer In',
        transactionId: deposit.id,
        bankName: toBank?.bank_name || 'Bank',
        initiatedBy: data.user,
        amount: data.amount,
        details: data.memo || `Bank Transfer Request: Incoming`,
        status: 'To Audit'
      }
    });

    return { withdrawal, deposit };
  });
}

export const recordBankAdjustment = async (data: {
  bankAccountId: string;
  amount: number;
  type: 'DEBIT' | 'CREDIT';
  date: Date;
  reference?: string;
  memo?: string;
  user: string;
}) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Create Bank Transaction
    const bt = await tx.bankTransaction.create({
      data: {
        bankAccountId: data.bankAccountId,
        type: 'ADJUSTMENT',
        status: 'TO_AUDIT',
        amount: Math.abs(data.amount),
        balanceAfter: 0,
        reference: data.reference,
        particulars: data.memo || 'Bank Adjustment',
        sourceType: 'ADJUSTMENT',
        date: data.date
      }
    });

    const bank = await tx.bankAccount.findUnique({ where: { id: data.bankAccountId } });

    // 2. Create Audit Log
    await tx.auditLog.create({
      data: {
        actionType: 'Bank Adjustment',
        transactionId: bt.id,
        bankName: bank?.bank_name || 'Bank',
        initiatedBy: data.user,
        amount: Math.abs(data.amount),
        details: data.memo || `Bank Adjustment Request`,
        status: 'To Audit'
      }
    });

    return { success: true, transactionId: bt.id };
  });
}

export const recordBankDeposit = async (data: {
  bankGlId: string;
  amount: number;
  date: Date;
  reference?: string;
  memo?: string;
  user: string;
  allocations: { accountId: string; amount: number; memo?: string }[];
}) => {
  return await prisma.$transaction(async (tx) => {
    const bankAccount = await tx.account.findUnique({ where: { id: data.bankGlId } });
    if (!bankAccount) throw new Error('Bank account not found');

    const totalAllocated = data.allocations.reduce((sum, a) => sum + a.amount, 0);
    if (Math.abs(totalAllocated - data.amount) > 0.01) {
      throw new Error('Total allocations must equal the deposit amount');
    }

    // 1. Debit Bank Account
    const bankTx = await tx.transaction.create({
      data: {
        date: data.date,
        code: 'DEPOSIT',
        particulars: data.memo || 'Bank Deposit',
        transNo: data.reference || `DEP-${Date.now()}`,
        accountNumber: bankAccount.account_no.toString(),
        accountName: bankAccount.account_name,
        debit: data.amount,
        credit: 0,
        user: data.user
      }
    });

    // 2. Credit Allocation Accounts
    for (const alloc of data.allocations) {
      const targetAcc = await tx.account.findUnique({ where: { id: alloc.accountId } });
      if (!targetAcc) throw new Error(`Allocation account ${alloc.accountId} not found`);

      await tx.transaction.create({
        data: {
          date: data.date,
          code: 'DEPOSIT',
          particulars: alloc.memo || data.memo || 'Deposit Allocation',
          transNo: data.reference || `DEP-${Date.now()}`,
          accountNumber: targetAcc.account_no.toString(),
          accountName: targetAcc.account_name,
          debit: 0,
          credit: alloc.amount,
          user: data.user
        }
      });

      // Update target account balance (assuming standard credit decrease/increase depending on type)
      // For Income accounts, Credit increases balance.
      await tx.account.update({
        where: { id: targetAcc.id },
        data: { balance: { increment: alloc.amount } } // Simplification: assuming Income/Liability for deposits
      });
    }

    // Update bank balance
    await tx.account.update({
      where: { id: bankAccount.id },
      data: { balance: { increment: data.amount } }
    });

    // 3. Create Audit Log
    const bankAccountEntry = await tx.bankAccount.findFirst({ where: { gl_account_id: data.bankGlId } });

    await tx.auditLog.create({
      data: {
        actionType: 'Bank Deposit',
        transactionId: data.reference || `DEP-${Date.now()}`,
        bankName: bankAccountEntry?.bank_name || bankAccount.account_name,
        initiatedBy: data.user,
        amount: data.amount,
        details: data.memo || `Bank Deposit to ${bankAccount.account_name}`,
        status: 'To Audit'
      }
    });

    // 4. Record Bank Transaction for History
    if (bankAccountEntry) {
      const updatedAccount = await tx.account.findUnique({ where: { id: data.bankGlId } });
      await tx.bankTransaction.create({
        data: {
          bankAccountId: bankAccountEntry.id,
          transactionId: bankTx.id,
          type: 'CASH_IN',
          amount: data.amount,
          balanceAfter: updatedAccount?.balance || 0,
          reference: data.reference,
          particulars: data.memo || 'Bank Deposit'
        }
      });
    }

    return { success: true };
  });
}

export const applyTransactionToAccountBalance = async (
  accountNumber: string,
  debit: number,
  credit: number
) => {
  try {
    const accountNoInt = parseInt(accountNumber, 10);
    if (isNaN(accountNoInt)) return;

    const account = await prisma.account.findUnique({
      where: { account_no: accountNoInt },
      include: { accountTypeRel: true }
    });

    if (!account) return;

    // Default to Asset logic if baseType is unknown
    const baseType = account.accountTypeRel?.baseType || 'Asset';
    let balanceChange = 0;

    if (baseType === 'Asset' || baseType === 'Expense') {
      balanceChange = debit - credit;
    } else {
      // Liability, Equity, Income, etc.
      balanceChange = credit - debit;
    }

    if (balanceChange !== 0) {
      await prisma.account.update({
        where: { id: account.id },
        data: { balance: { increment: balanceChange } }
      });
    }
  } catch (error) {
    console.error('Error updating account balance:', error);
  }
}

export const updateAccountBalance = async (id: string, balance: number) => {
  return await prisma.account.update({
    where: { id },
    data: { balance },
  })
}

export const createAccount = async (data: {
  account_no: number;
  account_type_no: number;
  account_name: string;
  account_description?: string;
  account_type: string;
  account_type_id?: string;
  header: string;
  bank: string;
  account_category?: string;
  account_status?: string;
  fs_category?: string;
  balance?: number;
  date_created?: Date;
  bank_code?: string;
  bank_name?: string;
  bank_account_no?: string;
  currency?: string;
  branch?: string;
  linked_gl_id?: string;
  opening_balance?: number;
  opening_date?: Date;
}) => {
  const { bank_code, bank_name, bank_account_no, currency, branch, ...accountData } = data;
  return await prisma.account.create({
    data: accountData,
  })
}

export const upsertAccount = async (data: {
  account_no: number;
  account_type_no: number;
  account_name: string;
  account_description?: string;
  account_type: string;
  account_type_id?: string;
  header: string;
  bank: string;
  account_category?: string;
  account_status?: string;
  fs_category?: string;
  balance?: number;
  date_created?: Date;
  bank_code?: string;
  bank_name?: string;
  bank_account_no?: string;
  currency?: string;
  branch?: string;
  linked_gl_id?: string;
  opening_balance?: number;
  opening_date?: Date;
}) => {
  const { account_no, bank_code, bank_name, bank_account_no, currency, branch, ...updateData } = data;
  return await prisma.account.upsert({
    where: { account_no },
    update: {
      ...updateData,
    },
    create: {
      account_no,
      ...updateData,
    },
  })
}

export const updateAccount = async (id: string, data: {
  account_no?: number;
  account_name?: string;
  account_description?: string;
  account_type?: string;
  account_type_id?: string;
  header?: string;
  bank?: string;
  account_category?: string;
  account_status?: string;
  fs_category?: string;
  balance?: number;
  date_created?: Date;
  bank_code?: string;
  bank_name?: string;
  bank_account_no?: string;
  currency?: string;
  branch?: string;
  linked_gl_id?: string;
  opening_balance?: number;
  opening_date?: Date;
}) => {
  const { bank_code, bank_name, bank_account_no, currency, branch, ...updateData } = data;
  return await prisma.account.update({
    where: { id },
    data: updateData,
  })
}

export const deleteAccount = async (id: string) => {
  return await prisma.account.delete({
    where: { id },
  })
}

// Transaction operations
export const getTransactions = async (limit?: number, offset?: number) => {
  return await prisma.transaction.findMany({
    orderBy: { seq: 'asc' },
    take: limit,
    skip: offset,
  })
}

export const getRecentTransactions = async (limit: number = 5) => {
  return await prisma.transaction.findMany({
    orderBy: { date: 'desc' },
    take: limit,
  })
}

export const createTransaction = async (data: any) => {
  return await prisma.transaction.create({
    data,
  })
}

export const getTransactionsByAccount = async (accountNumber: string) => {
  return await prisma.transaction.findMany({
    where: { accountNumber },
    orderBy: { date: 'desc' },
  })
}

// Conversion Factor operations
export const getConversionFactors = async (productId?: string) => {
  return await prisma.conversionFactor.findMany({
    where: productId ? { productId } : undefined,
    orderBy: { createdAt: 'desc' },
  })
}

export const createConversionFactor = async (data: {
  productId: string;
  unitName: string;
  factor: number;
}) => {
  return await prisma.conversionFactor.create({
    data,
  })
}

export const updateConversionFactor = async (id: string, data: {
  productId?: string;
  unitName?: string;
  factor?: number;
}) => {
  return await prisma.conversionFactor.update({
    where: { id },
    data,
  })
}

export const deleteConversionFactor = async (id: string) => {
  return await prisma.conversionFactor.delete({
    where: { id },
  })
}

// Branch operations
export const getBranches = async () => {
  try {
    return await prisma.branch.findMany({
      include: {
        allocationWeights: true
      },
      orderBy: { name: 'asc' }
    });
  } catch (error) {
    console.error('Error in getBranches:', error);
    return [];
  }
}

export const createBranch = async (data: {
  name: string;
  code?: string;
  type?: string;
  logoUrl?: string;
  address?: string;
  phone?: string;
  isActive?: boolean;
  payTo?: string;
  accountNumber?: string;
  expenseAcct?: string;
  receivables?: string;
  depositAccount?: string;
  othersField?: string;
}) => {
  return await prisma.branch.create({
    data
  });
}

export const updateBranch = async (id: string, data: {
  name?: string;
  code?: string;
  type?: string;
  logoUrl?: string;
  address?: string;
  phone?: string;
  isActive?: boolean;
  payTo?: string;
  accountNumber?: string;
  expenseAcct?: string;
  receivables?: string;
  depositAccount?: string;
  othersField?: string;
}) => {
  return await prisma.branch.update({
    where: { id },
    data
  });
}

export const deleteBranch = async (id: string) => {
  return await prisma.branch.delete({
    where: { id }
  });
}

// Profit Center operations
export const getProfitCenters = async () => {
  try {
    return await prisma.profitCenter.findMany({
      orderBy: { id: 'asc' }
    });
  } catch (error) {
    console.error('Error in getProfitCenters:', error);
    return [];
  }
}

export const createProfitCenter = async (data: {
  id: string;
  name: string;
  description?: string;
  isActive?: boolean;
}) => {
  return await prisma.profitCenter.create({
    data
  });
}

export const updateProfitCenter = async (id: string, data: {
  name?: string;
  description?: string;
  isActive?: boolean;
}) => {
  return await prisma.profitCenter.update({
    where: { id },
    data
  });
}

export const deleteProfitCenter = async (id: string) => {
  return await prisma.profitCenter.delete({
    where: { id }
  });
}

// Cost Center operations
export const getCostCenters = async () => {
  try {
    return await prisma.costCenter.findMany({
      orderBy: { id: 'asc' }
    });
  } catch (error) {
    console.error('Error in getCostCenters:', error);
    return [];
  }
}

export const createCostCenter = async (data: {
  id: string;
  name: string;
  description?: string;
  isActive?: boolean;
}) => {
  return await prisma.costCenter.create({
    data
  });
}

export const updateCostCenter = async (id: string, data: {
  name?: string;
  description?: string;
  isActive?: boolean;
}) => {
  return await prisma.costCenter.update({
    where: { id },
    data
  });
}

export const deleteCostCenter = async (id: string) => {
  return await prisma.costCenter.delete({
    where: { id }
  });
}
