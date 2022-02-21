import { useMemo, useCallback, useEffect, useRef, useState, useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CellValue } from 'react-table';
import { useIntl, FormattedMessage } from 'react-intl';
import { useTheme } from 'styled-components';
import { HoneycombThemeType, Checkbox } from '@binance-chain/honeycomb';

import { roundValue } from '@dex-kit/utils/number';
import { getTokenType } from '@dex-kit/utils/tokenTypes';
import { useWindowSize, useAppDispatch, useAppSelector } from '@dex-kit/hooks';
import { getTradeHistoryByAddressQS, TradeType } from '@dex-kit/store/trade';

import { Side } from '../Side';
import { DateCell } from '../DateCell';
import { PairFilter } from '../PairFilter';
import { TypeFilter } from '../TypeFilter';
import { DateFilter } from '../DateFilter';
import { Empty } from '../Empty';
import { SmallerTable } from '../SmallerTable';

import { StyledTable, TableContainer, Filters, LeftFilter, RightFilter } from '../styled';
import { Side as SideType } from '../types';

export const TradeHistory = () => {
  const {
    account: { address },
    exchange: { currentTrade },
    trade: {
      accountTradeHistory: { trade },
    },
  } = useAppSelector((state) => state);

  const { isSm } = useWindowSize();

  const intl = useIntl();

  const dispatch = useAppDispatch();

  const theme = useTheme() as HoneycombThemeType;

  const { symbol } = useParams<{ symbol: string }>();

  const [filterParams, setFilterParams] = useState(
    {} as { manualStartDate: string; manualEndDate: string; side?: number },
  );

  const [hideOtherPairs, setHideOtherPairs] = useState(false);

  const firstUpdate = useRef(true);

  const buildSide = useCallback(
    (trade) => {
      if (trade.buyerId === trade.sellerId) return 'Self';

      return trade.buyerId === address ? 'Buy' : 'Sell';
    },
    [address],
  );

  const data = useMemo(
    () =>
      trade
        .filter((el: TradeType) => (hideOtherPairs ? el.symbol === currentTrade : el))
        .map((trade: TradeType) => ({
          blockHeight: trade.blockHeight,
          date: trade.time,
          pair: '',
          quoteAsset: trade.quoteAsset,
          baseAsset: trade.baseAsset && trade.baseAsset.replace(/-.+/, ''),
          side: buildSide(trade),
          price: roundValue(trade.price),
          filled: roundValue(trade.quantity),
          total: roundValue(trade.price * trade.quantity),
        })),
    [trade, hideOtherPairs, currentTrade, buildSide],
  );

  const columns = useMemo(
    () => [
      {
        Header: <FormattedMessage id="exchange.blockHeight" />,
        accessor: 'blockHeight',
      } as const,
      {
        Header: <FormattedMessage id="exchange.date" />,
        accessor: 'date',
        Cell: ({ value }: CellValue) => <DateCell value={value} />,
      } as const,
      {
        Header: <FormattedMessage id="exchange.pair" />,
        accessor: 'pair',
        Cell: ({ row }: CellValue) => (
          <>{`${row.original.baseAsset} / ${row.original.quoteAsset}`}</>
        ),
      } as const,
      {
        Header: <FormattedMessage id="exchange.side" />,
        accessor: 'side',
        Cell: ({ value }: CellValue) => <Side side={value as SideType}>{value}</Side>,
      } as const,
      {
        Header: <FormattedMessage id="exchange.price" />,
        accessor: 'price',
      } as const,
      {
        Header: <FormattedMessage id="exchange.filled" />,
        accessor: 'filled',
      } as const,
      {
        Header: <FormattedMessage id="exchange.total" />,
        accessor: 'total',
      } as const,
    ],
    [],
  );

  const updateTradeHistory = useCallback(
    (opts?: { [key: string]: any }) => {
      const tokenType = getTokenType();
      const user = sessionStorage.getItem('user');
      const parsed = (user && JSON.parse(user)) || {};
      if (!parsed.address) return;
      if (opts) {
        if (filterParams.side && opts.side === 0) {
          delete filterParams.side;
          delete opts.side;
        }
        setFilterParams({ ...filterParams, ...opts });
      }

      const params = {
        address: parsed.address,
        offset: 0,
        limit: 50,
        ...filterParams,
        ...opts,
      };

      dispatch(getTradeHistoryByAddressQS({ params, withLoading: false, tokenType }));
    },
    [dispatch, filterParams],
  );

  const prevTrade = useRef(currentTrade).current;

  useEffect(() => {
    if (prevTrade === currentTrade) return;
    updateTradeHistory();
  }, [currentTrade, prevTrade, symbol, trade.length, updateTradeHistory]);

  useLayoutEffect(() => {
    if (firstUpdate.current) {
      updateTradeHistory();
      firstUpdate.current = false;
      return;
    }
  }, [updateTradeHistory]);

  return (
    <TableContainer>
      <Filters>
        <LeftFilter>
          <Checkbox
            onChange={() => setHideOtherPairs(!hideOtherPairs)}
            label={intl.formatMessage({ id: 'exchange.hideOtherPairs' })}
          />
        </LeftFilter>
        <RightFilter>
          {!isSm && (
            <>
              <PairFilter onFilterChange={updateTradeHistory} />
              <TypeFilter onFilterChange={updateTradeHistory} />
            </>
          )}
          <DateFilter onFilterChange={updateTradeHistory} />
        </RightFilter>
      </Filters>
      {isSm ? (
        <SmallerTable
          data={data}
          columns={columns}
          accessors={['price', 'total', 'blockHeight', 'filled', 'date']}
          usePairUtil={false}
        />
      ) : (
        <StyledTable
          header={{ fixed: true, background: theme.honeycomb.color.bg.normal }}
          data={data}
          columns={columns}
          interactive={true}
          className="styled-table-common"
        />
      )}
      {data.length === 0 && <Empty />}
    </TableContainer>
  );
};
