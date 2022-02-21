import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { floor, decimalPlaces, formatNumber } from '@dex-kit/utils/number';
import { useAppSelector, useAppDispatch } from '@dex-kit/hooks';
import { setCurrentPrice } from '@dex-kit/store/exchange/action';
import { Ticker } from '@dex-kit/store/tradePairs/types';

import { Wrapper } from './styled';
import { Positive, Negative } from '../styled';

export const LastPrice = ({
  canSetPrice = false,
  format = false,
}: {
  canSetPrice?: boolean;
  format?: boolean;
}) => {
  const {
    exchange: { currentTrade },
    tickers: { tickerSize: originalTickerSize, symbolTickers },
    trade: { tradeHistory },
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const [isDrop, setIsDrop] = useState(false);
  const trade = useMemo(() => (tradeHistory && tradeHistory.trade[0]) || {}, [tradeHistory]);
  const { price } = useMemo(
    () => symbolTickers.find((t: Ticker) => t.symbol && t.symbol.includes(currentTrade)) || {},
    [currentTrade, symbolTickers],
  );
  const value = useMemo(() => parseFloat(trade.price || price), [price, trade.price]);

  const tickerSize =
    decimalPlaces(Number(originalTickerSize[currentTrade])) > 6
      ? originalTickerSize[currentTrade]
      : '0.000001';

  const calValue = useCallback(() => {
    let ts = 8;
    if (tickerSize) {
      ts = decimalPlaces(Number(tickerSize));
    }
    return floor(value, ts);
  }, [tickerSize, value]);

  const prevPrice = useRef(trade.p).current;

  const clickPrice = useCallback(() => {
    canSetPrice && dispatch(setCurrentPrice(calValue()));
    calValue();
  }, [calValue, canSetPrice, dispatch]);

  const renderChange = useCallback(
    (value) => {
      if (!value) return <>-</>;
      if (value === '-') return <>-</>;

      let displayValue = calValue();
      displayValue = format
        ? formatNumber(Number(displayValue), decimalPlaces(Number(tickerSize)))
        : displayValue;

      if (isDrop) {
        return <Negative>{displayValue}</Negative>;
      }

      return <Positive>{displayValue}</Positive>;
    },
    [calValue, format, isDrop, tickerSize],
  );

  useEffect(() => {
    if (prevPrice === trade.p) return;
    setIsDrop(trade.p > prevPrice);
  }, [prevPrice, trade.p]);

  return <Wrapper onClick={() => clickPrice()}>{renderChange(value)}</Wrapper>;
};
