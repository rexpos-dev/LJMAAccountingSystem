
export interface Account {
    id?: string;
    number?: number;
    name: string;
    balance?: number;
    type: 'Asset' | 'Liability' | 'Equity' | 'Income' | 'Expense';
    header: 'Yes' | 'No';
    bank: 'Yes' | 'No';
    category?: string;
  }
  