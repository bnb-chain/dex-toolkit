import { AppDispatch } from '@dex-kit/store/store';

import httpRequest from '@dex-kit/utils/httpRequest';
import { TOKEN_TYPE_BEP8, TOKEN_TYPE_BEP2 } from '@dex-kit/utils/tokenTypes';

import { setTickerLotSize, setSymbolTickers } from '../tickers/action';

import { Pair, Ticker } from './types';

const TRADE_PAIR_BEP8_BLACK_LIST = [
  'btc',
  'etc',
  'eth',
  'bnb',
  'usdt',
  'busd',
  'bch',
  'ltc',
  'eos',
  'xrp',
  'ada',
  'bsv',
  'link',
];

export const SET_PAIRS = 'SET_PAIRS';

export const SET_IS_FETCHING_MARKETS = 'SET_IS_FETCHING_MARKETS';

export const ADD_UNLOGINED_FAVORITES = 'ADD_UNLOGINED_FAVORITES';

export const SET_FAVORITES = 'SET_FAVORITES';

export const setPairs = (data: Array<Pair>) => (dispatch: AppDispatch) =>
  dispatch({ type: SET_PAIRS, data });

export const setFavorites = (data: Array<string> | string) => (dispatch: AppDispatch) =>
  dispatch({ type: SET_FAVORITES, data });

export const setFetchingMarkets = (data: boolean) => (dispatch: AppDispatch) => {
  dispatch({ type: SET_IS_FETCHING_MARKETS, data });
};

const getBep2 = async () => {
  const pairs = await httpRequest.getBep2Pairs();
  const symbolTickers = await httpRequest.get24HrTickerForBep2();
  return {
    pairs: pairs.map((p: Pair) => {
      const ticker = symbolTickers.find(
        (st: Ticker) =>
          st.baseAssetName === p.base_asset_symbol && st.quoteAssetName === p.quote_asset_symbol,
      ) || { quoteVolume: 0 };

      return {
        ...p,
        volume: Number(ticker.quoteVolume),
        tokenType: TOKEN_TYPE_BEP2,
      };
    }),
    symbolTickers,
  };
};

const getBep8 = async () => {
  const pairs = await httpRequest.getBep8Pairs();
  const filterdPairs = pairs.filter(
    (pair: Pair) =>
      // eslint-disable-next-line camelcase
      !TRADE_PAIR_BEP8_BLACK_LIST.includes(pair?.base_asset_symbol?.split('-')[0]?.toLowerCase()),
  );
  const symbolTickers = await httpRequest.get24HrTickerForBep8();
  return {
    pairs: filterdPairs.map((p: Pair) => {
      const ticker = symbolTickers.find(
        (st: Ticker) =>
          st.baseAssetName === p.base_asset_symbol && st.quoteAssetName === p.quote_asset_symbol,
      ) || { quoteVolume: 0 };

      return {
        ...p,
        volume: Number(ticker.quoteVolume),
        tokenType: TOKEN_TYPE_BEP8,
      };
    }),
    symbolTickers,
  };
};

const getAllPairs = async () => {
  const bep2 = await getBep2();
  const bep8 = await getBep8();

  return {
    pairs: [...bep2.pairs, ...bep8.pairs] as Array<Pair>,
    symbolTickers: [...bep2.symbolTickers, ...bep8.symbolTickers],
  };
};

export const getPairs = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setFetchingMarkets(true));
    const { pairs, symbolTickers } = await getAllPairs();
    dispatch(setPairs(pairs));
    dispatch(setSymbolTickers(symbolTickers));
    dispatch(setTickerLotSize({ pairs }));
    dispatch(setFetchingMarkets(false));
  } catch (err) {
    console.log(`status:${err.status} message: ${err.statusText}`);
  }
};
