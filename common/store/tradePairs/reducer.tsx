import { AnyAction } from 'redux';
import { SET_PAIRS, SET_IS_FETCHING_MARKETS, SET_FAVORITES } from './action';
import { SUFFIX_B_COINS } from '../../utils/tradepair';
import { getAddress, getFavorites, getInitialFavorites } from '../../utils/favorites';

import { Pair, OmitPairNumberValue } from './types';

interface State {
  pairs: Array<Pair>;
  tabs: Array<string>;
  quoteAssets: Array<Pair>;
  isFetchingMarkets: boolean;
  favorites: { [key: string]: Array<string> } | string | Object;
}

const initialState: State = {
  pairs: [],
  tabs: [],
  quoteAssets: [],
  isFetchingMarkets: true,
  favorites: getInitialFavorites() || {},
};

const getAssets = (data: Array<Pair>, type: keyof OmitPairNumberValue) =>
  data.reduce((acc, cur: Pair) => {
    if (!acc.includes(cur[type])) acc.push(cur[type]);
    return acc;
  }, [] as Array<string>);

const getBep8Assets = (data: Array<Pair>, type: keyof OmitPairNumberValue) =>
  getAssets(data, type).filter((item) => item.startsWith('BNB') || item.startsWith('BUSD'));

const isAlts = (quoteAsset: string) =>
  !quoteAsset.includes('BTC') &&
  !quoteAsset.includes('BNB') &&
  !SUFFIX_B_COINS.find((s) => quoteAsset.includes(s));

const getTradePairTabs = (data: Array<Pair>) => {
  const tabs = [{ value: 'favorites', index: 0, displayName: 'favorites' }];
  const result = data.map((pair: Pair) => {
    const upperCaseQuote = pair.quote_asset_symbol.toUpperCase();

    if (upperCaseQuote.includes('BNB')) {
      pair.tab = 'BNB';
      if (!tabs.find((item) => item.value === 'BNB')) {
        tabs.push({ value: 'BNB', index: 1, displayName: 'BNB' });
      }
    }

    if (isAlts(upperCaseQuote)) {
      pair.tab = 'ALTS';
      if (!tabs.find((item) => item.value === 'ALTS')) {
        tabs.push({ value: 'ALTS', index: 3, displayName: 'ALTS' });
      }
    }

    if (upperCaseQuote.includes('BTCB')) {
      pair.tab = 'BTCB';
      if (!tabs.find((item) => item.value === 'BTCB')) {
        tabs.push({ value: 'BTCB', index: 2, displayName: 'BTC' });
      }
    } else if (
      SUFFIX_B_COINS.find((s) => upperCaseQuote.includes(s)) ||
      upperCaseQuote.includes('USD') ||
      upperCaseQuote.includes('PAX') ||
      upperCaseQuote.includes('TUSD')
    ) {
      pair.tab = 'FIATⓈ';
      if (!tabs.find((item) => item.value === 'FIATⓈ')) {
        tabs.push({ value: 'FIATⓈ', index: 4, displayName: 'FIATⓈ' });
      }
    }

    pair.price = pair.price || pair.list_price;
    pair.base_asset_displayname = pair.base_asset_symbol.replace(/-.+/i, '');
    pair.quote_asset_displayname = pair.quote_asset_symbol.replace(/-.+/i, '');

    if (SUFFIX_B_COINS.find((c) => pair.base_asset_symbol.toUpperCase().includes(c))) {
      pair.base_asset_displayname = pair.base_asset_symbol.replace(/B-.+/i, '');
    }

    if (SUFFIX_B_COINS.find((c) => pair.quote_asset_symbol.toUpperCase().includes(c))) {
      pair.quote_asset_displayname = pair.quote_asset_symbol.replace(/B-.+/i, '');
    }

    return pair;
  });

  const pairs = result.sort((a, b) => {
    if (a.tab === 'BNB' && b.tab === 'BNB') {
      return b.volume - a.volume;
    }
    if (a.tab === 'BNB' && b.tab !== 'BNB') {
      return -1;
    }
    if (a.tab !== 'BNB' && b.tab === 'BNB') {
      return 1;
    }
    return 1;
  });

  return {
    pairs,
    tabs: tabs.sort((a, b) => a.index - b.index).map((item) => item.displayName),
  };
};

const handleFavorites = (data: Array<string>) => {
  const address = getAddress();
  const favorites = getFavorites();
  if (address) {
    const userFavorites = favorites.favorites_logined?.find(
      (f: { [key: string]: Array<string> }) => !!f[address],
    );
    if (!userFavorites) {
      const newFavorites = {} as { [key: string]: Array<string> };
      newFavorites[address] = data || [];
      favorites.favorites_logined.push(newFavorites);
    } else if (data?.length > 0) {
      userFavorites[address] = data;
    }
  } else if (data?.length > 0) {
    favorites.favorites_unLogined = data;
  }

  window.localStorage.setItem('favorites', JSON.stringify(favorites));
  return data;
};

const tradePairs = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case SET_PAIRS:
      // eslint-disable-next-line no-case-declarations
      const { tabs, pairs }: { pairs: Array<Pair>; tabs: Array<string> } = getTradePairTabs(
        action.data,
      );
      return {
        ...state,
        pairs,
        tabs,
        quoteAssets: getAssets(action.data, 'quote_asset_symbol'),
        quoteAssetsForBep8: getBep8Assets(action.data, 'quote_asset_symbol'),
      };

    case SET_IS_FETCHING_MARKETS:
      return {
        ...state,
        isFetchingMarkets: action.data,
      };

    case SET_FAVORITES:
      return {
        ...state,
        favorites: handleFavorites(action.data),
      };

    default:
      return state;
  }
};

export default tradePairs;
