import { useMemo, useCallback, useEffect, useRef, useState, useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CellValue } from 'react-table';
import { useIntl, FormattedMessage } from 'react-intl';
import { useTheme } from 'styled-components';
import { Checkbox, HoneycombThemeType } from '@binance-chain/honeycomb';

import { roundValue } from '@dex-kit/utils/number';
import { getTokenType } from '@dex-kit/utils/tokenTypes';
import reduceTradePairBSuffix from '@dex-kit/utils/tradepair';
import convertOrderStatus from '@dex-kit/utils/convertOrderStatus';
import { useWindowSize, useAppDispatch, useAppSelector } from '@dex-kit/hooks';
import { getOrderHistoryQS, HistoryOrderType } from '@dex-kit/store/order';

import { Side } from '../Side';
import { DateCell } from '../DateCell';
import { Status } from '../Status';
import { TxHash } from '../TxHash';
import { DateFilter } from '../DateFilter';
import { Empty } from '../Empty';
import { SmallerTable } from '../SmallerTable';

import { StyledTable, TableContainer, Filters, LeftFilter, RightFilter } from '../styled';
import { Side as SideType, Status as StatusType } from '../types';

const LIMIT = 25;

export const OrderHistory = () => {
  const {
    exchange: { currentTrade },
    order: {
      orderHistory: { order },
    },
  } = useAppSelector((state) => state);

  const { isSm } = useWindowSize();

  const intl = useIntl();

  const dispatch = useAppDispatch();

  const theme = useTheme() as HoneycombThemeType;

  const { symbol } = useParams<{ symbol: string }>();

  const [filterParams, setFilterParams] = useState({});

  const [hideOtherPairs, setHideOtherPairs] = useState(false);

  const firstUpdate = useRef(true);

  const data = useMemo(
    () =>
      order
        .filter((el: HistoryOrderType) => (hideOtherPairs ? el.symbol === currentTrade : el))
        .map((order: HistoryOrderType) => ({
          txHash: order.transactionHash,
          id: order.orderId,
          date: order.transactionTime,
          pair: reduceTradePairBSuffix(order.symbol),
          side: order.side === 1 ? 'Buy' : 'Sell',
          average: order.average,
          price: roundValue(order.price),
          amount: roundValue(order.quantity),
          cumulateQuantity: roundValue(order.cumulateQuantity),
          filled: (order.cumulateQuantity / order.quantity) * 100,
          total: roundValue(order.price * order.quantity),
          status: convertOrderStatus(order.status),
        })),
    [currentTrade, hideOtherPairs, order],
  );

  const columns = useMemo(
    () => [
      {
        Header: <FormattedMessage id="exchange.txHash" />,
        accessor: 'txHash',
        Cell: ({ value }: CellValue) => <TxHash txHash={value} />,
      } as const,
      {
        Header: <FormattedMessage id="exchange.date" />,
        accessor: 'date',
        Cell: ({ value }: CellValue) => <DateCell value={value} />,
      } as const,
      {
        Header: <FormattedMessage id="exchange.pair" />,
        accessor: 'pair',
        Cell: ({ value }: CellValue) => <>{value.split('_').join(' / ')}</>,
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
        Header: <FormattedMessage id="exchange.amount" />,
        accessor: 'amount',
      } as const,
      {
        Header: <FormattedMessage id="exchange.filled" />,
        accessor: 'filled',
        Cell: ({ value }: CellValue) => <>{value}%</>,
      } as const,
      {
        Header: <FormattedMessage id="exchange.notional" />,
        accessor: 'total',
      } as const,
      {
        Header: <FormattedMessage id="exchange.status" />,
        accessor: 'status',
        Cell: ({ value }: CellValue) => <Status status={value as StatusType} />,
      } as const,
    ],
    [],
  );

  const updateOrderHistory = useCallback(
    (opts?: { [key: string]: any }) => {
      const tokenType = getTokenType();
      const user = sessionStorage.getItem('user');
      const parsed = (user && JSON.parse(user)) || {};
      if (!parsed.address) return;
      if (opts) setFilterParams({ ...filterParams, ...opts });

      const params = {
        address: parsed.address,
        offset: 0,
        total: 1,
        limit: LIMIT,
        ...filterParams,
        ...opts,
      };
      dispatch(getOrderHistoryQS({ params, withLoading: true, tokenType }));
    },
    [dispatch, filterParams],
  );

  const prevTrade = useRef(currentTrade).current;

  useEffect(() => {
    if (prevTrade === currentTrade) return;
    updateOrderHistory();
  }, [currentTrade, prevTrade, symbol, order.length, updateOrderHistory]);

  useLayoutEffect(() => {
    if (firstUpdate.current) {
      updateOrderHistory();
      firstUpdate.current = false;
      return;
    }
  }, [updateOrderHistory]);

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
          <DateFilter onFilterChange={updateOrderHistory} />
        </RightFilter>
      </Filters>
      {isSm ? (
        <SmallerTable
          data={data}
          columns={columns}
          accessors={['amount', 'price', 'total', 'txHash', 'date']}
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
