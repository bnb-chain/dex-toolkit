export type Pair = {
  base_asset_displayname: string;
  base_asset_symbol: string;
  list_price: string;
  lot_size: string;
  price: string;
  quote_asset_displayname: string;
  quote_asset_symbol: string;
  tab: string;
  tick_size: string;
  tokenType: string;
  volume: number;
  change: number;
};

export type OmitPairNumberValue = Omit<Pair, 'volume' | 'change'>;

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
