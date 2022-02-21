import { AnyAction } from '@reduxjs/toolkit';
import { SET_ACCOUNT_TRADE_HISTORY, SET_TRADE_HISTORY, SET_FETCH_TRADE_HISTORY } from './action';

import { TradeType, TradeHistoryType } from './types';

interface State {
  tradeHistory: TradeHistoryType;
  accountTradeHistory: TradeHistoryType;
  isFetchTradeHistory: boolean;
}

const initialState: State = {
  tradeHistory: { trade: [] },
  accountTradeHistory: { trade: [] },
  isFetchTradeHistory: false,
};

const castWSTT = (tt: number | string) => {
  switch (tt) {
    case 0:
      return 'Unknown';
    case 1:
      return 'SellTaker';
    case 2:
      return 'BuyTaker';
    case 3:
      return 'BuySurplus';
    case 4:
      return 'SellSurplus';
    case 5:
      return 'Neutral';
    default:
      return 'Unknown';
  }
};

const handleTradeHistory = (data: TradeHistoryType) => {
  data.trade = data.trade.map((item: TradeType) => ({
    ...item,
    tickType: item.tickType || castWSTT(item.tt),
  }));
  return data;
};

const Trade = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case SET_TRADE_HISTORY:
      return {
        ...state,
        tradeHistory: handleTradeHistory(action.data || ({} as TradeHistoryType)),
      };
    case SET_ACCOUNT_TRADE_HISTORY:
      return {
        ...state,
        accountTradeHistory: action.data,
      };

    case SET_FETCH_TRADE_HISTORY:
      return {
        ...state,
        isFetchTradeHistory: action.data,
      };

    default:
      return state;
  }
};

export default Trade;
