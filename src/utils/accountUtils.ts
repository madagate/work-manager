
export interface AccountTransaction {
  id: string;
  date: string;
  type: 'sale' | 'purchase' | 'payment' | 'receipt' | 'credit';
  description: string;
  amount: number;
  balance: number;
  invoiceNumber?: string;
  voucherNumber?: string;
  vatAmount?: number;
}

export interface CustomerAccount {
  customerId: string;
  transactions: AccountTransaction[];
  currentBalance: number;
  totalSales: number;
  totalPayments: number;
}

export interface SupplierAccount {
  supplierId: string;
  transactions: AccountTransaction[];
  currentBalance: number;
  totalPurchases: number;
  totalPayments: number;
}

// Mock storage
let customerAccounts: { [customerId: string]: CustomerAccount } = {};
let supplierAccounts: { [supplierId: string]: SupplierAccount } = {};

// Customer Account Functions
export const addTransactionToCustomer = (
  customerId: string,
  transaction: Omit<AccountTransaction, 'id' | 'balance'>
): void => {
  if (!customerAccounts[customerId]) {
    customerAccounts[customerId] = {
      customerId,
      transactions: [],
      currentBalance: 0,
      totalSales: 0,
      totalPayments: 0
    };
  }

  const account = customerAccounts[customerId];
  let balanceChange = 0;

  switch (transaction.type) {
    case 'sale':
      balanceChange = transaction.amount;
      account.totalSales += transaction.amount;
      break;
    case 'payment':
    case 'receipt':
      balanceChange = -transaction.amount;
      account.totalPayments += transaction.amount;
      break;
    case 'credit':
      balanceChange = -transaction.amount;
      break;
  }

  const newBalance = account.currentBalance + balanceChange;
  
  const newTransaction: AccountTransaction = {
    ...transaction,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
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
      currentBalance: 0,
      totalSales: 0,
      totalPayments: 0
    };
  }

  const account = customerAccounts[customerId];
  account.currentBalance = type === 'add' ? account.currentBalance + amount : account.currentBalance - amount;
};

// Supplier Account Functions
export const addTransactionToSupplier = (
  supplierId: string,
  transaction: Omit<AccountTransaction, 'id' | 'balance'>
): void => {
  if (!supplierAccounts[supplierId]) {
    supplierAccounts[supplierId] = {
      supplierId,
      transactions: [],
      currentBalance: 0,
      totalPurchases: 0,
      totalPayments: 0
    };
  }

  const account = supplierAccounts[supplierId];
  let balanceChange = 0;

  switch (transaction.type) {
    case 'purchase':
      balanceChange = transaction.amount;
      account.totalPurchases += transaction.amount;
      break;
    case 'payment':
      balanceChange = -transaction.amount;
      account.totalPayments += transaction.amount;
      break;
  }

  const newBalance = account.currentBalance + balanceChange;
  
  const newTransaction: AccountTransaction = {
    ...transaction,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    balance: newBalance
  };

  account.transactions.unshift(newTransaction);
  account.currentBalance = newBalance;
};

export const getSupplierAccount = (supplierId: string): SupplierAccount | null => {
  return supplierAccounts[supplierId] || null;
};

export const updateSupplierBalance = (supplierId: string, amount: number, type: 'add' | 'subtract'): void => {
  if (!supplierAccounts[supplierId]) {
    supplierAccounts[supplierId] = {
      supplierId,
      transactions: [],
      currentBalance: 0,
      totalPurchases: 0,
      totalPayments: 0
    };
  }

  const account = supplierAccounts[supplierId];
  account.currentBalance = type === 'add' ? account.currentBalance + amount : account.currentBalance - amount;
};

// Remove transactions (for delete operations)
export const removeCustomerTransaction = (customerId: string, transactionId: string): void => {
  const account = customerAccounts[customerId];
  if (!account) return;

  const transactionIndex = account.transactions.findIndex(t => t.id === transactionId);
  if (transactionIndex === -1) return;

  const transaction = account.transactions[transactionIndex];
  
  // Reverse the balance change
  let balanceChange = 0;
  switch (transaction.type) {
    case 'sale':
      balanceChange = -transaction.amount;
      account.totalSales -= transaction.amount;
      break;
    case 'payment':
    case 'receipt':
      balanceChange = transaction.amount;
      account.totalPayments -= transaction.amount;
      break;
    case 'credit':
      balanceChange = transaction.amount;
      break;
  }

  account.currentBalance += balanceChange;
  account.transactions.splice(transactionIndex, 1);

  // Recalculate balances for all subsequent transactions
  account.transactions.forEach((t, index) => {
    if (index === 0) {
      t.balance = account.currentBalance;
    } else {
      const prevTransaction = account.transactions[index - 1];
      let change = 0;
      switch (t.type) {
        case 'sale':
          change = t.amount;
          break;
        case 'payment':
        case 'receipt':
        case 'credit':
          change = -t.amount;
          break;
      }
      t.balance = prevTransaction.balance + change;
    }
  });
};

export const removeSupplierTransaction = (supplierId: string, transactionId: string): void => {
  const account = supplierAccounts[supplierId];
  if (!account) return;

  const transactionIndex = account.transactions.findIndex(t => t.id === transactionId);
  if (transactionIndex === -1) return;

  const transaction = account.transactions[transactionIndex];
  
  // Reverse the balance change
  let balanceChange = 0;
  switch (transaction.type) {
    case 'purchase':
      balanceChange = -transaction.amount;
      account.totalPurchases -= transaction.amount;
      break;
    case 'payment':
      balanceChange = transaction.amount;
      account.totalPayments -= transaction.amount;
      break;
  }

  account.currentBalance += balanceChange;
  account.transactions.splice(transactionIndex, 1);

  // Recalculate balances for all subsequent transactions
  account.transactions.forEach((t, index) => {
    if (index === 0) {
      t.balance = account.currentBalance;
    } else {
      const prevTransaction = account.transactions[index - 1];
      let change = 0;
      switch (t.type) {
        case 'purchase':
          change = t.amount;
          break;
        case 'payment':
          change = -t.amount;
          break;
      }
      t.balance = prevTransaction.balance + change;
    }
  });
};

// Remove transaction by invoice or voucher number
export const removeCustomerTransactionByInvoice = (customerId: string, invoiceNumber: string): void => {
  const account = customerAccounts[customerId];
  if (!account) return;

  const transaction = account.transactions.find(t => t.invoiceNumber === invoiceNumber);
  if (transaction) {
    removeCustomerTransaction(customerId, transaction.id);
  }
};

export const removeSupplierTransactionByInvoice = (supplierId: string, invoiceNumber: string): void => {
  const account = supplierAccounts[supplierId];
  if (!account) return;

  const transaction = account.transactions.find(t => t.invoiceNumber === invoiceNumber);
  if (transaction) {
    removeSupplierTransaction(supplierId, transaction.id);
  }
};

export const removeCustomerTransactionByVoucher = (customerId: string, voucherNumber: string): void => {
  const account = customerAccounts[customerId];
  if (!account) return;

  const transaction = account.transactions.find(t => t.voucherNumber === voucherNumber);
  if (transaction) {
    removeCustomerTransaction(customerId, transaction.id);
  }
};

export const removeSupplierTransactionByVoucher = (supplierId: string, voucherNumber: string): void => {
  const account = supplierAccounts[supplierId];
  if (!account) return;

  const transaction = account.transactions.find(t => t.voucherNumber === voucherNumber);
  if (transaction) {
    removeSupplierTransaction(supplierId, transaction.id);
  }
};

// Get all accounts for tax reporting
export const getAllCustomerAccounts = (): CustomerAccount[] => {
  return Object.values(customerAccounts);
};

export const getAllSupplierAccounts = (): SupplierAccount[] => {
  return Object.values(supplierAccounts);
};

// Tax calculation functions
export const getTaxDataForPeriod = (year: number, quarter: number) => {
  const startMonth = (quarter - 1) * 3 + 1;
  const endMonth = quarter * 3;
  const startDate = new Date(year, startMonth - 1, 1);
  const endDate = new Date(year, endMonth, 0);

  let totalSalesVAT = 0;
  let totalPurchaseVAT = 0;
  let totalSalesAmount = 0;
  let totalPurchaseAmount = 0;

  // Calculate from customer accounts
  Object.values(customerAccounts).forEach(account => {
    account.transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      if (transactionDate >= startDate && transactionDate <= endDate) {
        if (transaction.type === 'sale') {
          totalSalesAmount += transaction.amount;
          totalSalesVAT += transaction.vatAmount || 0;
        }
      }
    });
  });

  // Calculate from supplier accounts
  Object.values(supplierAccounts).forEach(account => {
    account.transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      if (transactionDate >= startDate && transactionDate <= endDate) {
        if (transaction.type === 'purchase') {
          totalPurchaseAmount += transaction.amount;
          totalPurchaseVAT += transaction.vatAmount || 0;
        }
      }
    });
  });

  return {
    salesAmount: totalSalesAmount,
    purchaseAmount: totalPurchaseAmount,
    salesVAT: totalSalesVAT,
    purchaseVAT: totalPurchaseVAT,
    netVAT: totalSalesVAT - totalPurchaseVAT
  };
};
