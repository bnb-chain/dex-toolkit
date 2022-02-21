import { useCallback, useMemo } from 'react';
import { useAppSelector } from '@dex-kit/hooks';

import { useRoundValue } from '../useRoundValue';

export const useBestValues = () => {
  const {
    exchange: { currentTrade },
    orderBooks,
    tickers: { tickerSize, lotSize },
  } = useAppSelector((state) => state);

  const { roundValue } = useRoundValue();

  const currentTickerSize = useMemo(() => tickerSize && tickerSize[currentTrade], [
    currentTrade,
    tickerSize,
  ]);

  const currentLotSize = useMemo(() => lotSize && lotSize[currentTrade], [currentTrade, lotSize]);

  const buildData = useCallback(
    (type) => {
      const result = [];
      const currentOrderBook = orderBooks && orderBooks[currentTrade];

      const data = currentOrderBook[type] || [];
      for (let len = data.length - 1; len >= 0; len--) {
        const item = data[len];
        result.push({
          price: item[0],
          amount: item[1],
          total: item[0] * item[1],
          type,
        });
      }
      return result;
    },
    [currentTrade, orderBooks],
  );

  const getBestValue = useCallback(
    ({ type, value, amount, total }) => {
      const data = buildData(type);
      console.log('data', data);
      if (!data)
        return {
          value,
          amount: '',
          total: '',
        };

      const best = data[data.length - 1] || {};
      value = roundValue(best.price, currentTickerSize);

      if (!amount && !total) {
        return {
          value,
          amount: '',
          total: '',
        };
      }

      if (total) {
        amount = roundValue(total / value, currentLotSize);
      } else {
        total = roundValue(amount * value, currentTickerSize);
      }

      return {
        value,
        amount,
        total,
      };
    },
    [buildData, currentLotSize, currentTickerSize, roundValue],
  );

  return {
    getBestValue,
  };
};
