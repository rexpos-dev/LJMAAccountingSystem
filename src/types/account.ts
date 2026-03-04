

export interface Account {
  id: string;
  account_no: number;
  account_type_no: number;
  account_name: string;
  account_description?: string;
  balance?: number;
  account_type: 'Asset' | 'Liability' | 'Equity' | 'Income' | 'Expense' | string;
  header: 'Yes' | 'No';
  bank: 'Yes' | 'No';
  account_category?: string;
  account_status?: string;
  fs_category?: string;
  date_created?: Date | string;
  last_updated_at?: Date | string;
  account_type_id?: string;
  bank_code?: string;
  bank_name?: string;
  bank_account_no?: string;
  currency?: string;
  branch?: string;
  linked_gl_id?: string;
  opening_balance?: number;
  opening_date?: Date | string;
}

