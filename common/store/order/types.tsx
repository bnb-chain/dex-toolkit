export type OpenOrderType = {
  transactionHash: string;
  orderCreateTime: number;
  symbol: string;
  pair: string;
  side: number;
  price: number;
  amount: number;
  cumulateQuantity: number;
  quantity: number;
  orderId: string;
};

export type HistoryOrderType = {
  transactionHash: string;
  orderId: string;
  transactionTime: number;
  symbol: string;
  side: number;
  average: number;
  price: number;
  amount: number;
  cumulateQuantity: number;
  filled: number;
  total: number;
  status: string;
  quantity: number;
};
