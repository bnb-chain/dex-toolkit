import { AppDispatch } from '@dex-kit/store/store';

export const SET_WALLET_CONNECT_URI = 'SET_WALLET_CONNECT_URI';

export const SET_IS_CONNECTED_WITH_WALLET = 'SET_IS_CONNECTED_WITH_WALLET';

export const setWalletConnectURI = (data: string) => (dispatch: AppDispatch) =>
  dispatch({
    type: SET_WALLET_CONNECT_URI,
    data,
  });

export const setIsConnectedWithWallet = (data: boolean) => (dispatch: AppDispatch) =>
  dispatch({
    type: SET_IS_CONNECTED_WITH_WALLET,
    data,
  });
