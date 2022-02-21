import { AppDispatch } from '@dex-kit/store/store';
import httpRequest from '@dex-kit/utils/httpRequest';

export const SET_BALANCES = 'SET_BALANCES';

export const SET_CURRENT_TRADE = 'SET_CURRENT_TRADE';

export const SET_TOKENS = 'SET_TOKENS';

export const SET_FIAT_CURRENCY = 'SET_FIAT_CURRENCY';

export const SET_CRYPTO_CURRENCY = 'SET_CRYPTO_CURRENCY';

export const SET_NODE_INFO = 'SET_NODE_INFO';

export const SET_CURRENT_PRICE = 'SET_CURRENT_PRICE';

export const SET_AMOUNT = 'SET_AMOUNT';

export const SET_SHOW_PRICE_NOTIFY = 'SET_SHOW_PRICE_NOTIFY';

export const SET_PRICE_CHECK = 'SET_PRICE_CHECK';

export const SET_PRICE_CHECK_TEXT = 'SET_PRICE_CHECK_TEXT';

export const SET_SHOW_TRADE_PAIRS_MOBILE = 'SET_SHOW_TRADE_PAIRS_MOBILE';

export const setCurrentTrade = (data: any) => (dispatch: AppDispatch) =>
  dispatch({ type: SET_CURRENT_TRADE, data });

export const setAmount = (data: any) => (dispatch: AppDispatch) =>
  dispatch({ type: SET_AMOUNT, data });

export const setCurrentPrice = (data: any) => (dispatch: AppDispatch) =>
  dispatch({ type: SET_CURRENT_PRICE, data });

export const setBalances = (data: any) => (dispatch: AppDispatch) =>
  dispatch({ type: SET_BALANCES, data });

export const setTokens = (data: any) => (dispatch: AppDispatch) =>
  dispatch({ type: SET_TOKENS, data });

export const setFiatCurrency = (data: any) => (dispatch: AppDispatch) =>
  dispatch({ type: SET_FIAT_CURRENCY, data });

export const setCryptoCurrency = (data: any) => (dispatch: AppDispatch) =>
  dispatch({ type: SET_CRYPTO_CURRENCY, data });

export const setShowPriceNotify = (data: any) => (dispatch: AppDispatch) => {
  dispatch({ type: SET_SHOW_PRICE_NOTIFY, data });
};

export const setShowTradePairsMobile = (data: any) => (dispatch: AppDispatch) => {
  dispatch({ type: SET_SHOW_TRADE_PAIRS_MOBILE, data });
};

export const setPriceCheck = (data: any) => (dispatch: AppDispatch) =>
  dispatch({ type: SET_PRICE_CHECK, data });

export const setPriceCheckText = (data: any) => (dispatch: AppDispatch) =>
  dispatch({ type: SET_PRICE_CHECK_TEXT, data });

export const getTokens = () => async (dispatch: AppDispatch) => {
  try {
    const tokens = await httpRequest.getTokens();
    const miniTokens = await httpRequest.getMiniTokens();
    dispatch(setTokens([...tokens, ...miniTokens]));
  } catch (err) {
    console.log(`status:${err.status} message: ${err.statusText}`);
  }
};

export const getCurrency = () => async (dispatch: AppDispatch) => {
  try {
    const fiatCurrency = await httpRequest.getFiatCurrency();
    const cryptoCurrency = await httpRequest.getCryptoCurrency();
    dispatch(setFiatCurrency(fiatCurrency));
    dispatch(setCryptoCurrency(cryptoCurrency));
  } catch (err) {
    console.log(`status:${err.status} message: ${err.statusText}`);
  }
};

export const getBalances = (address: string) => async (dispatch: AppDispatch) => {
  try {
    const balances = await httpRequest.getBalances(address);
    dispatch(setBalances(balances));
  } catch (err) {
    console.log(`status:${err.status} message: ${err.statusText}`);
  }
};
