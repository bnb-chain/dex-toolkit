import { AnyAction } from 'redux';
import { SET_ORDER_BOOK } from './action';

import { OrderBook } from './types';

interface State {
  [key: string]: OrderBook;
}

const initialState: State = {};

const handleOrderBook = (state = initialState, data: OrderBook) => {
  if (data) {
    state = state || {};
    const { symbol, asks, bids } = data;
    state[symbol] = { asks: asks.slice(0, 100), bids: bids.slice(0, 100), symbol };
  }
  return state;
};

const OrderBooks = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case SET_ORDER_BOOK:
      return handleOrderBook(state, action.data);
    default:
      return state;
  }
};

export default OrderBooks;
