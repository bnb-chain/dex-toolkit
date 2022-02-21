import { AppDispatch } from '@dex-kit/store/store';
import httpRequest from '@dex-kit/utils/httpRequest';

export const SET_ORDER_BOOK = 'SET_ORDER_BOOK';

export const setOrderBook = (data: any) => (dispatch: AppDispatch) =>
  dispatch({ type: SET_ORDER_BOOK, data });

export const getDepth = (params: any) => async (dispatch: AppDispatch) => {
  try {
    const depth = await httpRequest.getDepth(params);
    depth.symbol = params.symbol;
    dispatch(setOrderBook(depth));
  } catch (err) {
    console.log(`status:${err.status} message: ${err.statusText}`);
  }
};
