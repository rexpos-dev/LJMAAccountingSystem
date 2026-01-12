
export interface Account {
    id?: string;
    accnt_no?: number;
    accnt_type_no?: number;
    name: string;
    balance?: number;
    type: 'Asset' | 'Liability' | 'Equity' | 'Income' | 'Expense';
    header: 'Yes' | 'No';
    bank: 'Yes' | 'No';
    category?: string;
  }
  