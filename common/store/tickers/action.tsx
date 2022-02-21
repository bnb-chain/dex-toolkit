import httpRequest from '../../utils/httpRequest';
import { isMiniTokenEnabled } from '../../utils/env';

export const SET_TICKER_LOT_SIZE = 'SET_TICKER_LOT_SIZE';

export const SET_SYMBOL_TICKERS = 'SET_SYMBOL_TICKERS';

export const setTickerLotSize = (data) => (dispatch) =>
  dispatch({ type: SET_TICKER_LOT_SIZE, data });

export const setSymbolTickers = (data) => (dispatch) =>
  dispatch({ type: SET_SYMBOL_TICKERS, data });

export const getSymbolTickers = () => async (dispatch) => {
  try {
    const bep2 = await httpRequest.get24HrTickerForBep2();

    let bep8 = [];
    try {
      if (isMiniTokenEnabled) {
        bep8 = await httpRequest.get24HrTickerForBep8();
      }
    } catch (e) {
      console.error(`Cound not fetch BEP8 ticker values`, e);
    }

    dispatch(setSymbolTickers({ symbolTickers: [...bep2, ...bep8], from: 'rest' }));
  } catch (err) {
    console.log(`status:${err.status} message: ${err.statusText}`);
  }
};
