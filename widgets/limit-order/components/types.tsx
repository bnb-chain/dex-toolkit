export type OrderBookRow = {
  price: string;
  amount: string;
  total: string;
  type: string;
  median: number;
};

export type SelectedType = 'both' | 'asks' | 'bids';

export type MoonpayMode = 'test' | 'production';
