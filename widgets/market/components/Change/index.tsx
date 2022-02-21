import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import { calPrice, formatNumber, percentage } from '@dex-kit/utils';
import { RootState } from '@dex-kit/store/store';
import { Ticker } from '@dex-kit/store/tradePairs/types';
import { useAppSelector } from '@dex-kit/hooks';

import { Container, Title, Item } from './styled';

import { Positive, Negative } from '../styled';

export const Change = () => {
  const {
    exchange: { currentTrade },
    tickers: { symbolTickers },
  } = useAppSelector((state: RootState) => state);
  const { highPrice, lowPrice, priceChangePercent, quoteVolume } = useMemo(
    () => symbolTickers.find((t: Ticker) => t.symbol && t.symbol.includes(currentTrade)) || {},
    [currentTrade, symbolTickers],
  );

  const pair = useMemo(() => currentTrade.split('_'), [currentTrade]);
  const change = priceChangePercent || 0;

  return (
    <Container>
      <Item>
        <Title>
          <FormattedMessage id="exchange.symbolPriceInfo.twentyFourHChange" />
        </Title>
        <span>
          {parseFloat(change) >= 0 ? (
            <Positive>+${percentage(change, 1)}</Positive>
          ) : (
            <Negative>-${percentage(change, 1)}</Negative>
          )}
        </span>
      </Item>
      <Item>
        <Title>
          <FormattedMessage id="exchange.symbolPriceInfo.twentyFourHHigh" />
        </Title>
        <span>{highPrice && calPrice(highPrice)}</span>
      </Item>
      <Item>
        <Title>
          <FormattedMessage id="exchange.symbolPriceInfo.twentyFourHLow" />
        </Title>
        <span>{lowPrice && calPrice(lowPrice)}</span>
      </Item>
      <Item>
        <Title>
          <FormattedMessage id="exchange.symbolPriceInfo.twentyFourHVolume" />
        </Title>
        <span>
          {formatNumber(parseFloat(quoteVolume) || 0, 2)}
          {` ${pair[1] || ''}`}
        </span>
      </Item>
    </Container>
  );
};
