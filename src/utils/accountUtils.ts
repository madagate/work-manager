
export interface AccountTransaction {
  id: string;
  date: string;
  type: 'sale' | 'payment' | 'credit';
  description: string;
  amount: number;
  balance: number;
  invoiceNumber?: string;
}

export interface CustomerAccount {
  customerId: string;
  transactions: AccountTransaction[];
  currentBalance: number;
}

// Mock customer accounts storage
let customerAccounts: { [customerId: string]: CustomerAccount } = {};

export const addTransactionToCustomer = (
  customerId: string,
  transaction: Omit<AccountTransaction, 'id' | 'balance'>
): void => {
  if (!customerAccounts[customerId]) {
    customerAccounts[customerId] = {
      customerId,
      transactions: [],
      currentBalance: 0
    };
  }

  const account = customerAccounts[customerId];
  const newBalance = account.currentBalance + (transaction.type === 'sale' ? transaction.amount : -transaction.amount);
  
  const newTransaction: AccountTransaction = {
    ...transaction,
    id: Date.now().toString(),
    balance: newBalance
  };

  account.transactions.unshift(newTransaction);
  account.currentBalance = newBalance;
};

export const getCustomerAccount = (customerId: string): CustomerAccount | null => {
  return customerAccounts[customerId] || null;
};

export const updateCustomerBalance = (customerId: string, amount: number, type: 'add' | 'subtract'): void => {
  if (!customerAccounts[customerId]) {
    customerAccounts[customerId] = {
      customerId,
      transactions: [],
      currentBalance: 0
    };
  }

  const account = customerAccounts[customerId];
  account.currentBalance = type === 'add' ? account.currentBalance + amount : account.currentBalance - amount;
};
