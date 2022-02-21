export type OrderBookRow = {
  price: string;
  amount: string;
  total: string;
  type: string;
  median: number;
};

export type SelectedType = 'both' | 'asks' | 'bids';

export type Side = 'both' | 'buy' | 'sell';

export type Status = 'partial' | 'expired' | 'canceled' | 'filled' | 'failed';
