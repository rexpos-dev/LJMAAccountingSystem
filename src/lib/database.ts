import { prisma } from './prisma'

// Account operations
export const getAccounts = async () => {
  return await prisma.account.findMany({
    orderBy: { accnt_no: 'asc' },
  })
}

export const getBankAccounts = async () => {
  return await prisma.account.findMany({
    where: { bank: 'Yes' },
  })
}

export const updateAccountBalance = async (id: string, balance: number) => {
  return await prisma.account.update({
    where: { id },
    data: { balance },
  })
}

export const createAccount = async (data: {
  accnt_no: number;
  accnt_type_no: number;
  name: string;
  type: string;
  header: string;
  bank: string;
  category?: string;
  balance?: number;
}) => {
  return await prisma.account.create({
    data,
  })
}

export const updateAccount = async (id: string, data: {
  accnt_no?: number;
  name?: string;
  type?: string;
  header?: string;
  bank?: string;
  category?: string;
  balance?: number;
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
