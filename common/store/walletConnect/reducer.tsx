import { AnyAction } from 'redux';
import { SET_WALLET_CONNECT_URI, SET_IS_CONNECTED_WITH_WALLET } from './action';

const initialState = {
  wcUri: '',
  isConnectedWithWallet: false,
  walletAddress: '',
};

const walletConnect = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case SET_WALLET_CONNECT_URI:
      return {
        ...state,
        wcUri: action.data,
      };

    case SET_IS_CONNECTED_WITH_WALLET:
      return {
        ...state,
        isConnectedWithWallet: action.data,
      };

    default:
      return state;
  }
};

export default walletConnect;
