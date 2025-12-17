export const mockTransactions = JSON.stringify([
  {
    "transaction_id": "txn_12345",
    "date": "2023-10-26T10:00:00Z",
    "amount": 5000.00,
    "currency": "PHP",
    "description": "Invoice Payment #INV-2023-001",
    "from_account": "acct_business_checking",
    "to_account": "acct_supplier_alpha",
    "status": "completed"
  },
  {
    "transaction_id": "txn_12346",
    "date": "2023-10-26T11:30:00Z",
    "amount": 250.75,
    "currency": "PHP",
    "description": "Office Supplies",
    "from_account": "acct_corporate_card",
    "to_account": "acct_office_depot",
    "status": "completed"
  },
  {
    "transaction_id": "txn_12347",
    "date": "2023-10-27T14:00:00Z",
    "amount": 10000.00,
    "currency": "PHP",
    "description": "Urgent Fund Transfer",
    "from_account": "acct_business_savings",
    "to_account": "acct_unknown_offshore",
    "status": "completed"
  },
  {
    "transaction_id": "txn_12348",
    "date": "2023-10-27T14:05:00Z",
    "amount": 9999.99,
    "currency": "PHP",
    "description": "Reversal of txn_12347",
    "from_account": "acct_unknown_offshore",
    "to_account": "acct_business_savings",
    "status": "pending"
  },
    {
    "transaction_id": "txn_12349",
    "date": "2023-10-28T23:55:00Z",
    "amount": 499.99,
    "currency": "PHP",
    "description": "Marketing Subscription",
    "from_account": "acct_marketing_budget",
    "to_account": "acct_saas_provider",
    "status": "completed"
  }
], null, 2);

export const mockAuditLogs = JSON.stringify([
  {
    "log_id": "log_abcde",
    "timestamp": "2023-10-26T09:55:00Z",
    "user_id": "user_john.doe",
    "action": "login",
    "ip_address": "192.168.1.10",
    "status": "success"
  },
  {
    "log_id": "log_fghij",
    "timestamp": "2023-10-27T13:58:00Z",
    "user_id": "user_jane.smith",
    "action": "create_transaction",
    "details": "transaction_id: txn_12347, amount: 10000.00",
    "ip_address": "10.0.0.5",
    "status": "success"
  },
  {
    "log_id": "log_klmno",
    "timestamp": "2023-10-27T13:59:00Z",
    "user_id": "user_jane.smith",
    "action": "update_user_permissions",
    "details": "target_user: user_john.doe, new_role: admin",
    "ip_address": "203.0.113.25",
    "status": "failed",
    "reason": "Insufficient permissions"
  },
  {
    "log_id": "log_pqrst",
    "timestamp": "2023-10-27T14:04:00Z",
    "user_id": "user_jane.smith",
    "action": "initiate_reversal",
    "details": "transaction_id: txn_12347",
    "ip_address": "10.0.0.5",
    "status": "success"
  },
    {
    "log_id": "log_uvwxyz",
    "timestamp": "2023-10-28T23:50:00Z",
    "user_id": "system_auto",
    "action": "process_payment",
    "details": "transaction_id: txn_12349, time: 23:55:00Z",
    "ip_address": "localhost",
    "status": "success"
  }
], null, 2);
