import { TOKEN_TYPE_BEP2 } from '@dex-kit/utils/tokenTypes';
import httpRequest from '@dex-kit/utils/httpRequest';

import { AppDispatch } from '@dex-kit/store/store';
import { setLoading } from '@dex-kit/store/global/action';

import { OpenOrderType, HistoryOrderType } from './types';

export const SET_OPEN_ORDERS = 'SET_OPEN_ORDERS';

export const SET_ORDER_HISTORY = 'SET_ORDER_HISTORY';

export const SET_FETCH_OPEN_ORDERS = 'SET_FETCH_OPEN_ORDERS';

export const setOpenOrder = (data: OpenOrderType) => (dispatch: AppDispatch) =>
  dispatch({ type: SET_OPEN_ORDERS, data });

export const setOrderHistory = (data: HistoryOrderType) => (dispatch: AppDispatch) =>
  dispatch({ type: SET_ORDER_HISTORY, data });

export const setFetchOpenOrder = (data: boolean) => (dispatch: AppDispatch) =>
  dispatch({ type: SET_FETCH_OPEN_ORDERS, data });

export const getOpenOrdersQS = ({
  params,
  tokenType = TOKEN_TYPE_BEP2,
}: {
  params: any;
  tokenType: string;
}) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setFetchOpenOrder(true));
    const openOrders =
      tokenType === TOKEN_TYPE_BEP2
        ? await httpRequest.getOpenOrdersQS(params)
        : await httpRequest.getOpenOrdersQSForBep8(params);
    dispatch(setOpenOrder(openOrders));
    dispatch(setFetchOpenOrder(false));
  } catch (err) {
    dispatch(setFetchOpenOrder(false));
    console.log(`status:${err.status} message: ${err.statusText}`);
  }
};

export const getOrderHistoryQS = ({
  params,
  withLoading,
  tokenType = TOKEN_TYPE_BEP2,
}: {
  params: any;
  withLoading: boolean;
  tokenType: string;
}) => async (dispatch: AppDispatch) => {
  try {
    if (withLoading) dispatch(setLoading(true));
    const orderHistory =
      tokenType === TOKEN_TYPE_BEP2
        ? await httpRequest.getOrderHistoryQS(params)
        : await httpRequest.getOrderHistoryQSForBep8(params);
    dispatch(setOrderHistory(orderHistory));
    if (withLoading) dispatch(setLoading(false));
  } catch (err) {
    console.log(`status:${err.status} message: ${err.statusText}`);
    if (withLoading) dispatch(setLoading(false));
  }
};
