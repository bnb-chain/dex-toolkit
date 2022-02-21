import { AnyAction } from 'redux';
import {
  SET_BALANCES,
  SET_CURRENT_TRADE,
  SET_TOKENS,
  SET_FIAT_CURRENCY,
  SET_CRYPTO_CURRENCY,
  SET_CURRENT_PRICE,
  SET_AMOUNT,
  SET_SHOW_PRICE_NOTIFY,
  SET_PRICE_CHECK,
  SET_PRICE_CHECK_TEXT,
  SET_SHOW_TRADE_PAIRS_MOBILE,
} from './action';
import { SUFFIX_B_COINS } from '../../utils/tradepair';

const initialState = {
  currentTrade: '',
  displayCurrentTrade: '',
  currentPrice: '',
  buyAmount: '',
  sellAmount: '',
  priceNotifyText: '',
  tokens: [],
  fiatRate: {},
  cryptoCurrencyRate: {},
  showPriceNotify: false,
  hasPriceChecked: false,
  nodeInfo: {},
  peers: {},
  showTradePairsMobile: false,
};

const getDisplayedTrades = (currentTrade: string) => {
  const pair = currentTrade.split('_');
  let [baseAsset, quoteAsset] = pair;

  if (SUFFIX_B_COINS.find((c) => baseAsset.toUpperCase().includes(c))) {
    baseAsset = baseAsset.replace(/B-.+/i, '');
  }

  if (SUFFIX_B_COINS.find((c) => quoteAsset.toUpperCase().includes(c))) {
    quoteAsset = quoteAsset.replace(/B-.+/i, '');
  }

  return `${baseAsset}_${quoteAsset}`;
};

const buildTokens = (tokens: Array<any>) => {
  return tokens.map((t: any) => {
    if (SUFFIX_B_COINS.find((c) => t.symbol.toUpperCase().includes(c))) {
      t.original_symbol = t.symbol.replace(/B-.+/i, '');
    }
    return t;
  });
};

const exchange = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case SET_CURRENT_TRADE:
      return {
        ...state,
        currentTrade: action.data,
        displayCurrentTrade: getDisplayedTrades(action.data),
      };

    case SET_FIAT_CURRENCY:
      return {
        ...state,
        fiatRate: action.data,
      };

    case SET_CRYPTO_CURRENCY:
      return {
        ...state,
        cryptoCurrencyRate: action.data,
      };

    case SET_TOKENS:
      return {
        ...state,
        tokens: buildTokens(action.data),
      };

    case SET_BALANCES:
      return {
        ...state,
        balances: action.data,
      };

    case SET_CURRENT_PRICE:
      return {
        ...state,
        currentPrice: action.data,
      };

    case SET_AMOUNT:
      return {
        ...state,
        ...action.data,
      };

    case SET_SHOW_PRICE_NOTIFY:
      return {
        ...state,
        showPriceNotify: action.data,
      };

    case SET_PRICE_CHECK:
      return {
        ...state,
        hasPriceChecked: action.data,
      };

    case SET_PRICE_CHECK_TEXT:
      return {
        ...state,
        priceNotifyText: action.data,
      };

    case SET_SHOW_TRADE_PAIRS_MOBILE:
      return {
        ...state,
        showTradePairsMobile: action.data,
      };

    default:
      return state;
  }
};

export default exchange;
