import { combineReducers } from 'redux';

// import create from './create/reducer';
import account from './account/reducer';
// import chart from './chart/reducer';
import exchange from './exchange/reducer';
import node from './node/reducer';
// import transaction from './transaction/reducer';
import globalData from './global/reducer';
import tickers from './tickers/reducer';
import order from './order/reducer';
import fees from './fees/reducer';
import trade from './trade/reducer';
import orderBooks from './orderbooks/reducer';
// import i18n from '../i18n/reducer';
import tradePairs from './tradePairs/reducer';
import walletConnect from './walletConnect/reducer';
// import googleDrive from './googleDrive/reducer';
// import staking from './staking/reducer';

export * from './account/action';
// export * from './chart/action';
// export * from './create/action';
// export * from './exchange/action';
// export * from './fees/action';
export * from './global/action';
// export * from './googleDrive/action';
// export * from './node/action';
export * from './order/action';
export * from './orderbooks/action';
export * from './tickers/action';
export * from './trade/action';
// export * from './tradePairs/action';
// export * from './transaction/action';
export * from './walletConnect/action';

export const rootReducer = combineReducers({
  // i18n,
  // create,
  account,
  // chart,
  exchange,
  node,
  // transaction,
  globalData,
  tickers,
  order,
  fees,
  trade,
  orderBooks,
  tradePairs,
  walletConnect,
  // googleDrive,
  // staking,
});
