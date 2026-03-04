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

export const getBankAccounts = async () => {
  try {
    const accounts = await prisma.$queryRaw`
            SELECT * FROM chart_of_account 
            WHERE bank = 'Yes'
        `;
    return Array.isArray(accounts) ? accounts : [];
  } catch (error) {
    console.error('Error in getBankAccounts:', error);
    return [];
  }
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
}) => {
  return await prisma.account.create({
    data,
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
}) => {
  const { account_no, ...updateData } = data;
  return await prisma.account.upsert({
    where: { account_no },
    update: {
      ...updateData,
    },
    create: data,
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
}) => {
  return await prisma.account.update({
    where: { id },
    data,
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
