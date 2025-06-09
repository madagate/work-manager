
export interface Customer {
  id: string;
  customerCode: string;
  name: string;
  phone: string;
  description?: string;
  lastPurchase: string;
  totalAmount: number;
  averagePrice: number;
  purchases: any[];
  notes?: string;
  isBlocked?: boolean;
  blockReason?: string;
  last2Quantities?: number[];
  last2Prices?: number[];
}
