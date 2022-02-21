export type TradeType = {
  tt: number;
  tickType: number | string;
  p: number;
  price: number;
  q: number;
  amount: number;
  quantity: number;
  time: number;
  T: number;
  s?: string;
  symbol: string;
  quoteAsset: string;
  baseAsset: string;
  blockHeight: number;
};

export type TradeHistoryType = { trade: Array<TradeType> };
