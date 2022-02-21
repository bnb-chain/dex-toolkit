import { AppDispatch } from '@dex-kit/store/store';
import httpRequest from '@dex-kit/utils/httpRequest';
import { setLoading } from '../global/action';

export const SET_BLOCK_FEE_HISTORY = 'SET_BLOCK_FEE_HISTORY';

export const SET_FEES = 'SET_FEES';

export const setBlockFeeHistory = (data: any) => (dispatch: AppDispatch) => {
  dispatch({ type: SET_BLOCK_FEE_HISTORY, data });
};

export const setFees = (data: any) => (dispatch: AppDispatch) => {
  dispatch({ type: SET_FEES, data });
};

export const getBlockFees = (params: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const data = await httpRequest.getBlockExchangeFees(params);
    dispatch(setBlockFeeHistory(data));
    dispatch(setLoading(false));
  } catch (err) {
    console.log(`status:${err.status} message: ${err.statusText}`);
    dispatch(setLoading(false));
  }
};

export const getFees = () => async (dispatch: AppDispatch) => {
  try {
    const fees = await httpRequest.getFees();
    dispatch(setFees(fees));
  } catch (err) {
    console.log(`status:${err.status} message: ${err.statusText}`);
  }
};
