export type GetBanksResponse = {
  status: string;
  responseCode: string;
  message: string;
  data: GetBanksData[];
};

export type GetBanksData = {
  bank_name: string;
  bank_code: string;
  bank_logo: string;
};

export type BankNameEnquiry = {
  account_number: string;
  bank_code: string;
};

export type BankTransfer = {
  amount: number | null;
  destination_account: string;
  receipient_name: string;
  bank_code: string;
  transaction_pin: string;
  platform: string;
  name_enquiry_ref: string;
  description: string;
};

export type WalletNameEnquiry = {
  account_number: string;
};

export type WalletTransfer = {
  amount: number | null;
  destination_account: string;
  receipient_name: string;
  transaction_pin: string;
  platform: string;
};

export type GetBalance = {
  status: string;
  responseCode: string;
  message: string;
  data: {
    balance: string;
    credit: number;
    debit: number;
  };
};

export type TransactionItem = {
  id: number;
  user_id: number | null;
  customer_id: number;
  branch_id: number | null;
  amount: string;
  type: string;
  device: string;
  system_interest: number;
  slip: string;
  is_approve: string;
  destination_account: string;
  destination_name: string;
  destination_bank_code: string;
  provider_name: string;
  provider_session_id: string;
  provider_request: string;
  provider_response: string;
  narration: string;
  transfer_type: string;
  reference_no: string;
  notes: string;
  status: string;
  status_type: string;
  trnx_type: string;
  initiated_by: string;
  approve_by: string | null;
  approve_date: string | null;
  created_at: string;
  updated_at: string;
  bank: null;
};

// Transaction statistics
export type TransactionStats = {
  highest_transaction: string;
  lowest_transaction: string;
  total_transactions: number;
  total_volume: string;
};

// Full API response
export type TransactionsResponse = {
  status: string;
  responseCode: string;
  message: string;
  stats: TransactionStats;
  transactions: TransactionItem[];
};

export type TransactionReceipt = {
  status: string;
  responseCode: string;
  message: string;
  data: {
    id: number;
    user_id: number | null;
    customer_id: number;
    branch_id: number | null;
    amount: string;
    type: string;
    device: string;
    system_interest: number;
    slip: string | null;
    is_approve: string;
    destination_account: string;
    destination_name: string;
    destination_bank_code: string;
    provider_name: string;
    provider_session_id: string;
    provider_request: string;
    provider_response: string;
    narration: string;
    transfer_type: string;
    reference_no: string;
    notes: string;
    status: string;
    status_type: string;
    trnx_type: string;
    initiated_by: string;
    approve_by: string | null;
    approve_date: string | null;
    created_at: string;
    updated_at: string;
    bank: null;
  };
};
