import { AnyAction } from 'redux';
import { SET_TICKER_LOT_SIZE, SET_SYMBOL_TICKERS } from './action';

import { Ticker, TickerSize, LotSize } from './types';

interface State {
  tickerSize: TickerSize;
  lotSize: LotSize;
  symbolTickers: Array<Ticker>;
}

const initialState: State = {
  tickerSize: {},
  lotSize: {},
  symbolTickers: [],
};

const setTickerLotSize = (state = initialState, action: AnyAction) => {
  const tickerSize = {} as TickerSize;
  const lotSize = {} as LotSize;
  const {
    data: { pairs },
  } = action;
  if (Array.isArray(pairs)) {
    pairs.forEach((pair) => {
      const symbol = `${pair.base_asset_symbol}_${pair.quote_asset_symbol}`;
      tickerSize[symbol] = pair.tick_size;
      lotSize[symbol] = pair.lot_size;
    });
  }
  return {
    ...state,
    tickerSize,
    lotSize,
  };
};

const setSymbolTickers = (state = initialState, action: AnyAction) => {
  const {
    data: { from },
  } = action;
  const {
    data: { symbolTickers },
  } = action;
  if (!Array.isArray(symbolTickers)) return state;

  if (from === 'rest') {
    return {
      ...state,
      symbolTickers: symbolTickers.map((s) => ({
        symbol: s.symbol,
        priceChangePercent: s.priceChangePercent / 100,
        baseAssetVolume: s.volume,
        quoteVolume: s.quoteVolume,
        volume: Number(s.quoteVolume),
        price: s.lastPrice,
        highPrice: s.highPrice,
        lowPrice: s.lowPrice,
      })),
    };
  }

  if (from === 'ws') {
    return {
      ...state,
      symbolTickers,
    };
  }

  return state;
};

const Tickers = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case SET_TICKER_LOT_SIZE:
      return setTickerLotSize(state, action);

    case SET_SYMBOL_TICKERS:
      return setSymbolTickers(state, action);

    default:
      return state;
  }
};

export default Tickers;
