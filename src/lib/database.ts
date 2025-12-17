import { prisma } from './prisma'

// Account operations
export const getAccounts = async () => {
  return await prisma.account.findMany({
    orderBy: { number: 'asc' },
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
  number: number;
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
  number?: number;
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
