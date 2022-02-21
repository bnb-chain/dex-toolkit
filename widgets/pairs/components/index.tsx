import { useState, useCallback, useMemo } from 'react';

import { useAppSelector } from '@dex-kit/hooks';
import { floor, formatNumber } from '@dex-kit/utils/number';

import { Search } from './Search';
import { RadioFields } from './RadioFields';
import { Filtered } from './Filtered';
import { Tabs } from './Tabs';

import { Container, Filters } from './styled';

export const Main = () => {
  const [query, setQuery] = useState('');
  const [checkedValue, setCheckedValue] = useState('change');
  const [selectedTab, setSelectedTab] = useState('BNB');

  const {
    tickers: { symbolTickers },
    trade: { tradeHistory },
    tradePairs: { pairs, tabs, favorites },
  } = useAppSelector((state) => state);

  const getTicker = useCallback(
    (el) =>
      symbolTickers.find(
        (item) => item.symbol === `${el.base_asset_symbol}_${el.quote_asset_symbol}`,
      ) || {
        symbol: '',
        priceChangePercent: 0,
        baseAssetVolume: '',
        quoteVolume: '',
        volume: '',
        price: 0,
        highPrice: 0,
        lowPrice: 0,
      },
    [symbolTickers],
  );

  const trade = useMemo(() => (tradeHistory && tradeHistory.trade[0]) || {}, [tradeHistory]);

  const getPrice = useCallback(
    (el) => {
      if (!trade) return;
      const price =
        trade.s === `${el.base_asset_symbol}_${el.quote_asset_symbol}`
          ? trade.p
          : getTicker(el).price || el.price;
      const tickDps = Math.abs(Math.log10(Number(el.tick_size)));
      return floor(Number(price), tickDps);
    },
    [getTicker, trade],
  );

  const selectedPairs = useMemo(() => {
    let filtered = [];
    if (selectedTab === 'favorites') {
      /* @ts-ignore */
      filtered = pairs.filter((el) =>
        /* @ts-ignore */
        favorites.find(
          /* @ts-ignore */
          (f) =>
            f === `${el.base_asset_symbol}/${el.quote_asset_symbol}` &&
            (el.base_asset_symbol.toLowerCase().includes(query.toLowerCase()) ||
              el.quote_asset_symbol.toLowerCase().includes(query.toLowerCase())),
        ),
      );
    } else {
      /* @ts-ignore */
      filtered = pairs.filter(
        /* @ts-ignore */
        (el) =>
          el.tab.includes(selectedTab) &&
          el.base_asset_displayname.toLowerCase().includes(query.toLowerCase()),
      );
    }
    /* @ts-ignore */
    return filtered.map((el) => ({
      ...el,
      price: getPrice(el) || 0,
      priceForSorting: Number(getPrice(el)) || 0,
      change: getTicker(el).priceChangePercent || 0,
      volume: formatNumber(Number(getTicker(el).volume), 2) || 0,
      volumeForSorting: Number(getTicker(el).volume) || 0,
      key: el.base_asset_symbol ? `${el.base_asset_symbol}/${el.quote_asset_symbol}` : '',
    }));
  }, [selectedTab, pairs, favorites, query, getPrice, getTicker]);

  const onTabChange = useCallback((value) => setSelectedTab(value), []);

  const onSearchChange = useCallback((evt) => setQuery(evt.target.value), []);

  const onRadioChange = useCallback((evt) => setCheckedValue(evt.target.value), []);

  return (
    <Container>
      <Tabs onTabChange={onTabChange} selectedTab={selectedTab} tabs={tabs} />
      <Filters>
        <Search onSearchChange={onSearchChange} query={query} />
        <RadioFields onRadioChange={onRadioChange} checkedValue={checkedValue} />
      </Filters>
      <Filtered data={selectedPairs} checkedValue={checkedValue} />
    </Container>
  );
};
