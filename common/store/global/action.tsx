import { AppDispatch } from '@dex-kit/store/store';
import httpRequest from '@dex-kit/utils/httpRequest';

export const SET_GLOBAL_LOADING = 'SET_GLOBAL_LOADING';

export const SET_NOT_LOGIN_NOTIFY = 'SET_NOT_LOGIN_NOTIFY';

export const SET_CONFIRM_AUTH_ELE = 'SET_CONFIRM_AUTH_ELE';

export const SET_IS_IP_VALIDATED = 'SET_IS_IP_VALIDATED';

export const SET_SHOW_IP_VALIDATION = 'SET_SHOW_IP_VALIDATION';

export const setLoading = (data: any) => (dispatch: AppDispatch) =>
  dispatch({
    type: SET_GLOBAL_LOADING,
    data,
  });

export const setShowIpValidation = (data: any) => (dispatch: AppDispatch) =>
  dispatch({
    type: SET_SHOW_IP_VALIDATION,
    data,
  });

export const setNotLoginNotify = (data: any) => (dispatch: AppDispatch) =>
  dispatch({
    type: SET_NOT_LOGIN_NOTIFY,
    data,
  });

export const setTriggerElement = (data: any) => (dispatch: AppDispatch) =>
  dispatch({
    type: SET_CONFIRM_AUTH_ELE,
    data,
  });

export const setIpValidate = (data: any) => (dispatch: AppDispatch) =>
  dispatch({
    type: SET_IS_IP_VALIDATED,
    data,
  });

export const getIpValidation = () => async (dispatch: AppDispatch) => {
  try {
    const res = await httpRequest.ipValidate();
    dispatch(setIpValidate(res));
  } catch (err) {
    console.log(`status:${err.status} message: ${err.statusText}`);
  }
};
