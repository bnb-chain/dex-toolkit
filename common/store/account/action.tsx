import { AppDispatch } from '@dex-kit/store/store';
import httpRequest from '@dex-kit/utils/httpRequest';

export const SET_ACCOUNT = 'account/SET_ACCOUNT';
export const SET_USER_INFO = 'account/SET_USER_INFO';
export const SET_NEED_AUTH = 'account/SET_NEED_AUTH';

export const setAccount = (data: any) => (dispatch: AppDispatch) =>
  dispatch({
    type: SET_ACCOUNT,
    data,
  });

export const setUserInfo = (data: any) => (dispatch: AppDispatch) =>
  dispatch({
    type: SET_USER_INFO,
    data,
  });

export const setNeedAuth = (data: any) => (dispatch: AppDispatch) =>
  dispatch({
    type: SET_NEED_AUTH,
    data,
  });

export const getAccount = (address: string) => async (dispatch: AppDispatch) => {
  try {
    const userInfo: any = await httpRequest.getAccount(address);
    dispatch(setUserInfo(userInfo));
  } catch (err) {
    console.log(`status:${err.status} message: ${err.statusText}`);
  }
};
