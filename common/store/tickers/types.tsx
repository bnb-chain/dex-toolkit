export type Ticker = {
  symbol: string;
  priceChangePercent: number;
  baseAssetVolume: string;
  quoteVolume: string;
  volume: string;
  price: number;
  highPrice: number;
  lowPrice: number;
  baseAssetName: string;
  quoteAssetName: string;
  s: string; // symbol
  v: string; // baseAssetVolume
  q: string; // quoteVolume
  c: string; // price
  h: string; // highPrice
  l: string; // lowPrice
  o: string;
};

export type LotSize = { [key: string]: string };

export type TickerSize = { [key: string]: string };
