export type OrderBook = {
  asks: Array<any>;
  bids: Array<any>;
  symbol: string;
};

export type OrderBooks = { [key: string]: OrderBook };
