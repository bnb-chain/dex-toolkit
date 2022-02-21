import { useMemo, useState, useCallback, useEffect } from 'react';
import { CellValue } from 'react-table';
import { FormattedMessage } from 'react-intl';
import { useTheme } from 'styled-components';
import { HoneycombThemeType, Space } from '@binance-chain/honeycomb';

import { formatNumber, decimalPlaces } from '@dex-kit/utils/number';
import { Icon } from '@dex-kit/utils/icons';
import { useAppDispatch, useAppSelector } from '@dex-kit/hooks';
import { setCurrentPrice, setAmount } from '@dex-kit/store/exchange';

import { LastPrice } from '@widget/market/components/LastPrice';
import { USDPrice } from '@widget/market/components/USDPrice';

import {
  Container,
  StyledTable,
  DumbHeader,
  Positive,
  Negative,
  PriceContainer,
  PriceInner,
  Filters,
  Filter,
  TableContainer,
  Setter,
  LastPriceContainer,
  USDPriceContainer,
} from './styled';

import { OrderBookRow, SelectedType } from './types';

export const Main = () => {
  const {
    account: { userInfo },
    exchange: { currentTrade },
    orderBooks,
    tickers: { tickerSize, lotSize, symbolTickers },
  } = useAppSelector((state) => state);

  const dispatch = useAppDispatch();

  const theme = useTheme() as HoneycombThemeType;

  const [selected, setSelected] = useState('both' as SelectedType);

  const currentOrderBook = useMemo(() => orderBooks && orderBooks[currentTrade], [
    currentTrade,
    // eslint-disable-next-line
    JSON.stringify(orderBooks),
    orderBooks,
  ]);

  const currentTickerSize =
    decimalPlaces(Number(tickerSize[currentTrade])) > 6 ? tickerSize[currentTrade] : '0.000001';

  const currentLotSize =
    decimalPlaces(Number(lotSize[currentTrade])) > 6 ? lotSize[currentTrade] : '0.000001';

  const median = useMemo(() => {
    const sorted =
      currentOrderBook &&
      currentOrderBook.bids
        .map((bid) => bid[1])
        .concat(currentOrderBook.asks.map((ask) => ask[1]))
        .sort((a, b) => a - b);

    if (!sorted) return 0;

    const medianIdx = (sorted.length * 3) / 4;
    return Number(sorted[medianIdx]);
  }, [currentOrderBook]);

  const getData = useCallback(
    (type: 'asks' | 'bids') => {
      const result: Array<OrderBookRow> = [];
      currentOrderBook &&
        currentOrderBook[type].forEach((el: Array<number>) => {
          result.push({
            price: formatNumber(el[0], decimalPlaces(Number(currentTickerSize))),
            amount: formatNumber(el[1], decimalPlaces(Number(currentLotSize))),
            total: formatNumber(el[0] * el[1], decimalPlaces(Number(currentTickerSize))),
            type,
            median: Math.min(el[1] / median, 1) * 100,
          });
        });

      return type === 'asks' ? result.reverse() : result;
    },
    [currentLotSize, currentOrderBook, currentTickerSize, median],
  );

  const onRowClick = useCallback(
    ({ original: { price, amount, type } }) => () => {
      if (!currentTrade) return;

      amount = parseFloat(amount);
      dispatch(setCurrentPrice(price));

      const [baseAsset, quoteAsset] = currentTrade.split('_');
      const balances = userInfo.balances || [];
      /* @ts-ignore */
      const quotaAssetBalance = balances.find((b) => b.symbol && b.symbol === quoteAsset) || {
        free: 0,
        frozen: 0,
        locked: 0,
      };
      /* @ts-ignore */
      const baseAssetBalance = balances.find((b) => b.symbol && b.symbol === baseAsset) || {
        free: 0,
        frozen: 0,
        locked: 0,
      };
      const symbolTicker = symbolTickers.find((s) => s.symbol === currentTrade) || {};

      const amountObj = {} as { buyAmount?: number; sellAmount?: number };
      if (type === 'asks') {
        const maxBuyAmount = parseFloat(quotaAssetBalance.free) / parseFloat(symbolTicker.price);

        amountObj.buyAmount = maxBuyAmount > amount ? amount : maxBuyAmount;
      }

      if (type === 'bids') {
        amountObj.sellAmount =
          parseFloat(baseAssetBalance.free) > amount ? amount : parseFloat(baseAssetBalance.free);
      }
      dispatch(setAmount(amountObj));
    },
    [currentTrade, dispatch, symbolTickers, userInfo.balances],
  );

  const asksColumns = useMemo(
    () => [
      {
        Header: <FormattedMessage id="exchange.price" />,
        accessor: 'price',
        Cell: ({ value, row }: CellValue) => (
          <Setter onClick={() => dispatch(setCurrentPrice(row.original.price))}>
            <Negative>{value}</Negative>
          </Setter>
        ),
      } as const,
      {
        Header: <FormattedMessage id="exchange.amount" />,
        accessor: 'amount',
        Cell: ({ value, row }: CellValue) => <Setter onClick={onRowClick(row)}>{value}</Setter>,
      } as const,
      {
        Header: <FormattedMessage id="exchange.total" />,
        accessor: 'total',
      } as const,
      {
        accessor: 'median',
        Cell: () => <div className="data-cell data-asks-cell"></div>,
      } as const,
    ],
    [dispatch, onRowClick],
  );

  const bidsColumns = useMemo(
    () => [
      {
        Header: <FormattedMessage id="exchange.price" />,
        accessor: 'price',
        Cell: ({ value, row }: CellValue) => (
          <Setter onClick={() => dispatch(setCurrentPrice(row.original.price))}>
            <Positive>{value}</Positive>
          </Setter>
        ),
      } as const,
      {
        Header: <FormattedMessage id="exchange.amount" />,
        accessor: 'amount',
        Cell: ({ value, row }: CellValue) => <Setter onClick={onRowClick(row)}>{value}</Setter>,
      } as const,
      {
        Header: <FormattedMessage id="exchange.total" />,
        accessor: 'total',
      } as const,
      {
        accessor: 'median',
        Cell: () => <div className="data-cell data-bids-cell"></div>,
      } as const,
    ],
    [dispatch, onRowClick],
  );

  useEffect(() => {
    if (selected === 'asks') {
      const target = document.querySelector('.data-asks div');

      if (target) {
        target.scrollTo(0, target.scrollHeight);
      }
    }
  }, [selected]);

  return (
    <Container>
      <Filters>
        <Filter active={selected === 'both'} onClick={() => setSelected('both')}>
          <Icon.OrderBookAsksBids />
        </Filter>
        <Filter active={selected === 'asks'} onClick={() => setSelected('asks')}>
          <Icon.OrderBookAsks />
        </Filter>
        <Filter active={selected === 'bids'} onClick={() => setSelected('bids')}>
          <Icon.OrderBookBids />
        </Filter>
      </Filters>
      <DumbHeader
        header={{ fixed: true, background: theme.honeycomb.color.bg.normal }}
        data={[]}
        columns={asksColumns}
      />
      {selected !== 'bids' && (
        <TableContainer full={selected !== 'both'}>
          <Space size="micro" />
          <StyledTable
            header={{ display: false }}
            data={getData('asks')}
            columns={asksColumns}
            interactive={true}
            className="data-asks"
            full={selected !== 'both'}
          />
        </TableContainer>
      )}
      <PriceContainer>
        <PriceInner>
          <LastPriceContainer>
            <LastPrice />
          </LastPriceContainer>
          <Space size="tiny" />
          <USDPriceContainer>
            <USDPrice />
          </USDPriceContainer>
        </PriceInner>
        <PriceInner>
          <Icon.Signal fill={theme.honeycomb.color.success.normal} />
        </PriceInner>
      </PriceContainer>
      {selected !== 'asks' && (
        <TableContainer full={selected !== 'both'}>
          <StyledTable
            header={{ display: false }}
            data={getData('bids')}
            columns={bidsColumns}
            interactive={true}
            className="data-bids"
            full={selected !== 'both'}
          />
          <Space size="tiny" />
        </TableContainer>
      )}
    </Container>
  );
};
