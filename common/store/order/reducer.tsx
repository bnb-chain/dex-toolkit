import { AnyAction } from '@reduxjs/toolkit';
import { SET_OPEN_ORDERS, SET_ORDER_HISTORY, SET_FETCH_OPEN_ORDERS } from './action';

import { OpenOrderType, HistoryOrderType } from './types';
interface State {
  openOrders: {
    order: Array<OpenOrderType>;
    total: number;
  };
  orderHistory: {
    order: Array<HistoryOrderType>;
    total: number;
  };
  isFetchOpenOrders: boolean;
}

const initialState: State = {
  openOrders: {
    order: [] as Array<OpenOrderType>,
    total: 0,
  },
  orderHistory: {
    order: [] as Array<HistoryOrderType>,
    total: 0,
  },
  isFetchOpenOrders: false,
};

const Order = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case SET_OPEN_ORDERS:
      return {
        ...state,
        openOrders: action.data,
      };

    case SET_ORDER_HISTORY:
      return {
        ...state,
        orderHistory: action.data,
      };

    case SET_FETCH_OPEN_ORDERS:
      return {
        ...state,
        isFetchOpenOrders: action.data,
      };

    default:
      return state;
  }
};

export default Order;
