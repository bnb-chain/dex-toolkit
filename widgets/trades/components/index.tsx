import { useMemo, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { CellValue } from 'react-table';
import { FormattedMessage } from 'react-intl';
import { useTheme } from 'styled-components';
import { HoneycombThemeType } from '@binance-chain/honeycomb';

import { getTokenType } from '@dex-kit/utils/tokenTypes';
import { useAppDispatch, useAppSelector, useWindowSize } from '@dex-kit/hooks';
import { getTradeHistoryQS } from '@dex-kit/store/trade';
import { setCurrentPrice, setAmount } from '@dex-kit/store/exchange';

import { Container, StyledTable, Positive, Negative, Title, TableContainer } from './styled';

export const Main = () => {
  const {
    account: { userInfo },
    exchange: { currentTrade },
    trade: { tradeHistory },
    tickers: { symbolTickers },
  } = useAppSelector((state) => state);

  const dispatch = useAppDispatch();

  const theme = useTheme() as HoneycombThemeType;

  const { isMd } = useWindowSize();

  const { symbol } = useParams<{ symbol: string }>();

  const renderPriceCell = useCallback((val, type) => {
    if (type.toLowerCase().includes('sell')) {
      return <Negative>{val}</Negative>;
    }
    return <Positive>{val}</Positive>;
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: <FormattedMessage id="exchange.price" />,
        accessor: 'price',
        Cell: ({ row, value }: CellValue) => renderPriceCell(value, row.original.tickType),
      } as const,
      {
        Header: <FormattedMessage id="exchange.amount" />,
        accessor: 'amount',
      } as const,
      {
        Header: <FormattedMessage id="exchange.tradingHistory.time" />,
        accessor: 'time',
      } as const,
    ],
    [renderPriceCell],
  );

  const data = useMemo(
    () =>
      tradeHistory.trade.map((trade) => ({
        tickType: trade.tickType,
        price: trade.p || trade.price,
        amount: trade.q || trade.amount || trade.quantity,
        time: trade.T
          ? new Date(trade.T / 10 ** 6).toTimeString().split(' ')[0]
          : new Date(trade.time).toTimeString().split(' ')[0],
      })),
    [tradeHistory],
  );

  const updateTradeHistory = useCallback(() => {
    const tokenType = getTokenType();
    if (!currentTrade) return;
    const tradeParams = {
      offset: 0,
      limit: 50,
      symbol: symbol || currentTrade,
      end: new Date().getTime(),
    };
    dispatch(getTradeHistoryQS({ params: tradeParams, tokenType }));
  }, [currentTrade, dispatch, symbol]);

  const prevTrade = useRef(currentTrade).current;

  const onRowClick = useCallback(
    ({ original: { price, amount, type } }) => {
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

  useEffect(() => {
    if (prevTrade === currentTrade && tradeHistory.trade.length > 0) return;
    updateTradeHistory();
  }, [currentTrade, prevTrade, symbol, tradeHistory.trade.length, updateTradeHistory]);

  return (
    <Container>
      <Title>
        <FormattedMessage id="exchange.tradingHistory.title" />
      </Title>
      <TableContainer isMd={isMd}>
        <StyledTable
          header={{ fixed: true, background: theme.honeycomb.color.bg.normal }}
          data={data}
          columns={columns}
          interactive={true}
          onRowClick={({ data }) => onRowClick(data)}
        />
      </TableContainer>
    </Container>
  );
};
