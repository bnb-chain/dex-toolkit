import { useMemo } from 'react';

import { calPrice } from '@dex-kit/utils/number';
import { useAppSelector } from '@dex-kit/hooks';

import { Price } from './styled';

export const USDPrice = () => {
  const {
    exchange: { currentTrade, cryptoCurrencyRate },
    tickers: { symbolTickers },
    trade: { tradeHistory },
  } = useAppSelector((state) => state);

  const trade = useMemo(() => (tradeHistory && tradeHistory.trade[0]) || {}, [tradeHistory]);
  const { price } = useMemo(
    () => symbolTickers.find((t) => t.symbol && t.symbol.includes(currentTrade)) || {},
    [currentTrade, symbolTickers],
  );

  const lastPrice = useMemo(() => parseFloat(trade.price || price), [price, trade.price]);

  const xBNBSymbol = useMemo(
    () => symbolTickers.find((st) => st.symbol === `BNB_${trade.quoteAsset}`),
    [symbolTickers, trade.quoteAsset],
  );

  const value = useMemo(() => {
    const quotaAsset = trade.quoteAsset && trade.quoteAsset.replace(/[.-].+/, '');
    const key = Object.keys(cryptoCurrencyRate).find((c) => c.includes(quotaAsset));

    if (key && cryptoCurrencyRate[key] && !trade.quoteAsset.includes('USDT')) {
      return `$${calPrice(lastPrice * cryptoCurrencyRate[key])}`;
    }

    if (!xBNBSymbol) return '';

    return `$${calPrice((1 / xBNBSymbol.price) * lastPrice * cryptoCurrencyRate.BNB_USDT)}`;
  }, [cryptoCurrencyRate, lastPrice, trade.quoteAsset, xBNBSymbol]);

  return <Price>{value}</Price>;
};
