import { AnyAction } from 'redux';
import { SET_ACCOUNT, SET_USER_INFO, SET_NEED_AUTH } from './action';

import { Balance } from './types';

interface State {
  needAuth: boolean;
  address: string;
  cipher: string;
  privateKey: string;
  keyStore: string;
  mnemonic: string;
  encryptedData: any;
  network: {
    id: string;
    name: string;
  };
  flags: {
    isHardware: boolean;
    isWalletConnect: boolean;
    isExtensionWallet: boolean;
  };
  wcUri: string;
  userInfo: {
    balances: Array<Balance>;
  };
}

const getInitialState = () => {
  let user = sessionStorage.getItem('user');
  const userObject = (user && JSON.parse(user)) || {};
  let state = {};

  if (userObject && userObject.address) {
    const { address, flags, privateKey } = userObject;
    state = {
      address,
      flags,
      encryptedData: privateKey,
    };

    if (flags.isHardware || flags.isExtensionWallet) {
      state = {
        ...state,
        privateKey: 'HARDWARE',
      };
    }
  }
  return state;
};

const initialState: State = {
  needAuth: false,
  address: '',
  cipher: '',
  privateKey: '', // or "HARDWARE" if hardware, "COINOMI", "INFINITO", etc...
  keyStore: '',
  mnemonic: '',
  encryptedData: {},
  network: {
    id: '',
    name: '',
  },
  // isHardware, isLedger, ...
  flags: {
    isHardware: false,
    isLedger: false,
    isTrezor: false,
    isCoinomi: false,
    isCoinomiEmulate: false, // emulate mode (for testing)
    isInfinito: false,
    isInfinitoEmulate: false, // emulate mode (for testing)
    isWalletConnect: false,
    isExtensionWallet: false,
  },
  wcUri: '',
  userInfo: {
    balances: [],
  },
  ...getInitialState(),
};

let newNeedAuth;

const handUserInfo = (userInfo: any) => {
  const balances = userInfo.balances || [];

  userInfo.balances = balances.map((b: any) => ({
    ...b,
    free: parseFloat(b.free),
    frozen: parseFloat(b.frozen),
    locked: parseFloat(b.locked),
  }));

  return userInfo;
};

const account = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case SET_ACCOUNT:
      return {
        ...state,
        ...action.data,
      };

    case SET_USER_INFO:
      return {
        ...state,
        userInfo: handUserInfo(action.data),
      };

    case SET_NEED_AUTH:
      // This is a quick fix to prevent `needAuth` being set for hardware wallets.
      // The session password popup should never be shown in this case.
      newNeedAuth = action.data;
      if (state.flags.isHardware) newNeedAuth = false;
      return {
        ...state,
        needAuth: newNeedAuth,
      };
    default:
      return state;
  }
};

export default account;
