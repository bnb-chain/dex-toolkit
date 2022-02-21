import { TOKEN_TYPE_BEP2 } from '@dex-kit/utils/tokenTypes';
import httpRequest from '@dex-kit/utils/httpRequest';

import { AppDispatch } from '@dex-kit/store/store';
import { setLoading } from '@dex-kit/store/global/action';

import { TradeHistory } from './types';

export const SET_ACCOUNT_TRADE_HISTORY = 'SET_ACCOUNT_TRADE_HISTORY';

export const SET_TRADE_HISTORY = 'SET_TRADE_HISTORY';

export const SET_FETCH_TRADE_HISTORY = 'SET_FETCH_TRADE_HISTORY';

export const setTradeHistory = (data: TradeHistory) => (dispatch: AppDispatch) =>
  dispatch({ type: SET_TRADE_HISTORY, data });

export const setFetchTradesHistory = (data: boolean) => (dispatch: AppDispatch) => {
  dispatch({ type: SET_FETCH_TRADE_HISTORY, data });
};

export const setAccountTradeHistory = (data: any) => (dispatch: AppDispatch) => {
  dispatch({ type: SET_ACCOUNT_TRADE_HISTORY, data });
};

export const getTradeHistoryQS = ({
  params,
  tokenType = TOKEN_TYPE_BEP2,
}: {
  params: any;
  tokenType: string;
}) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setFetchTradesHistory(true));

    const tradeHistory =
      tokenType === TOKEN_TYPE_BEP2
        ? await httpRequest.getOrderTradeHistoryQS(params)
        : await httpRequest.getOrderTradeHistoryQSForBep8(params);
    dispatch(setTradeHistory(tradeHistory));
    dispatch(setFetchTradesHistory(false));
  } catch (err) {
    console.log(`status:${err.status} message: ${err.statusText}`);
  }
};

export const getTradeHistoryByAddressQS = ({
  params,
  withLoading,
  tokenType = TOKEN_TYPE_BEP2,
}: {
  params: any;
  withLoading: boolean;
  tokenType: string;
}) => async (dispatch: AppDispatch) => {
  try {
    if (withLoading) {
      dispatch(setLoading(true));
    }
    const tradeHistory =
      tokenType === TOKEN_TYPE_BEP2
        ? await httpRequest.getOrderTradeHistoryQS(params)
        : await httpRequest.getOrderTradeHistoryQSForBep8(params);
    dispatch(setAccountTradeHistory(tradeHistory));
    if (withLoading) {
      dispatch(setLoading(false));
    }
  } catch (err) {
    console.log(`status:${err.status} message: ${err.statusText}`);
  }
};
