import { AnyAction } from 'redux';
import {
  SET_GLOBAL_LOADING,
  SET_NOT_LOGIN_NOTIFY,
  SET_CONFIRM_AUTH_ELE,
  SET_IS_IP_VALIDATED,
  SET_SHOW_IP_VALIDATION,
} from './action';

const initialState = {
  isLoading: false,
  showNotLoginNotify: false,
  triggerElement: null,
  isIpValid: true,
  isShowIpValidation: true,
  deviceInfo: {},
};

const global = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case SET_GLOBAL_LOADING:
      return {
        ...state,
        isLoading: action.data,
      };

    case SET_SHOW_IP_VALIDATION:
      return {
        ...state,
        isShowIpValidation: action.data,
      };

    case SET_NOT_LOGIN_NOTIFY:
      return {
        ...state,
        showNotLoginNotify: action.data,
      };

    case SET_CONFIRM_AUTH_ELE:
      return {
        ...state,
        triggerElement: action.data,
      };

    case SET_IS_IP_VALIDATED:
      return {
        ...state,
        isIpValid: action.data,
      };

    default:
      return state;
  }
};

export default global;
