import { useEffect, memo, useMemo, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { RootState } from '@dex-kit/store/store';
import { getCurrency, getTokens, setCurrentTrade } from '@dex-kit/store/exchange/action';
import { getPeers } from '@dex-kit/store/node/action';
import { Pair } from '@dex-kit/store/tradePairs/types';
import { getPairs } from '@dex-kit/store/tradePairs/action';
import { getFees } from '@dex-kit/store/fees/action';
import { getAccount } from '@dex-kit/store/account/action';
import { getIpValidation } from '@dex-kit/store/global/action';
import { useCurrentTokenType } from '@dex-kit/utils/tokenTypes';

const CommonDataProvider = memo(() => {
  const dispatch = useDispatch();
  const { symbol } = useParams<{ symbol: string }>();
  const tokenType = useCurrentTokenType();
  const currentTrade = useSelector((state: RootState) => state.exchange.currentTrade);
  const allPairs = useSelector((state: RootState) => state.tradePairs.pairs);
  const filteredPairs = useMemo(() => allPairs.filter((it: Pair) => it.tokenType === tokenType), [
    allPairs,
    tokenType,
  ]);

  const getDefaultTrade = useCallback(() => {
    const defaultPair = filteredPairs[0];
    const firstTradeSymbol = `${defaultPair.base_asset_symbol}_${defaultPair.quote_asset_symbol}`;
    dispatch(setCurrentTrade(firstTradeSymbol));
  }, [dispatch, filteredPairs]);

  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;

    dispatch(getCurrency());
    dispatch(getPeers());
    dispatch(getFees());
    dispatch(getTokens());
    dispatch(getPairs());
    dispatch(getIpValidation());

    const user = sessionStorage.getItem('user');
    const parsed = (user && JSON.parse(user)) || {};

    if (parsed.address) {
      dispatch(getAccount(parsed.address));
    }

    loaded.current = true;
  }, [dispatch]);

  useEffect(() => {
    if (!currentTrade && filteredPairs.length > 0) {
      if (symbol) {
        const pairs = symbol.split('_');
        const target = filteredPairs.find(
          (el: Pair) =>
            el.base_asset_symbol.includes(pairs[0]) && el.quote_asset_symbol.includes(pairs[1]),
        );

        if (target) {
          dispatch(setCurrentTrade(symbol));
        } else {
          getDefaultTrade();
        }
      } else {
        getDefaultTrade();
      }
    }
  }, [dispatch, currentTrade, filteredPairs, symbol, getDefaultTrade]);

  return null;
});

export default CommonDataProvider;
