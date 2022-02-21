import { useMemo, useCallback, useEffect, useRef, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CellValue } from 'react-table';
import { useIntl, FormattedMessage } from 'react-intl';
import { useTheme } from 'styled-components';
import {
  Toast,
  createToast,
  Button,
  Checkbox,
  Space,
  HoneycombThemeType,
  Dropdown,
} from '@binance-chain/honeycomb';

import { roundValue } from '@dex-kit/utils/number';
import { getTokenType } from '@dex-kit/utils/tokenTypes';
import hasPrivateKey, { isUnlockWithWalletConnect } from '@dex-kit/utils/account';
import reduceTradePairBSuffix from '@dex-kit/utils/tradepair';
import httpRequest from '@dex-kit/utils/httpRequest';
import { setOpenOrder } from '@dex-kit/store';
import { useAppDispatch, useAppSelector, useWindowSize } from '@dex-kit/hooks';
import { getOpenOrdersQS, OpenOrderType } from '@dex-kit/store/order';
import { setTriggerElement, setLoading } from '@dex-kit/store/global';
import { setNeedAuth } from '@dex-kit/store/account';
import { setWalletConnectURI } from '@dex-kit/store/walletConnect';
import { Context as WCClientContext } from '@dex-kit/context/WalletConnectProvider';
import { Context as BNCClientContext } from '@dex-kit/context/BNCClientProvider';

import { Confirm } from '../Confirm';
import { Side } from '../Side';
import { DateCell } from '../DateCell';
import { TxHash } from '../TxHash';
import { Empty } from '../Empty';
import { SmallerTable } from '../SmallerTable';

import { Side as SideType } from '../types';

import {
  StyledTable,
  DefaultTarget,
  TableContainer,
  ToastContainer,
  ToastDescription,
  Filters,
  LeftFilter,
  RightFilter,
} from '../styled';

const LIMIT = 30;

export const OpenOrders = () => {
  const {
    account: {
      privateKey,
      address,
      flags: { isExtensionWallet },
    },
    exchange: { currentTrade },
    order: {
      openOrders: { order },
    },
  } = useAppSelector((state) => state);

  const { isSm } = useWindowSize();

  const intl = useIntl();

  const theme = useTheme() as HoneycombThemeType;

  const bncClient = useContext(BNCClientContext);

  const wcClient = useContext(WCClientContext);

  const dispatch = useAppDispatch();

  const { symbol } = useParams<{ symbol: string }>();

  const [open, setOpen] = useState(false);

  const [hideOtherPairs, setHideOtherPairs] = useState(false);

  const [targetOrders, setTargetOrders] = useState([] as Array<OpenOrderType>);

  const updateOpenOrders = useCallback(
    (opts?: any) => {
      const tokenType = getTokenType();
      const user = sessionStorage.getItem('user');
      const parsed = (user && JSON.parse(user)) || {};
      if (!parsed.address) return;

      const params = {
        address: parsed.address,
        offset: 0,
        total: 1,
        limit: LIMIT,
        ...opts,
      };

      dispatch(getOpenOrdersQS({ params, tokenType }));
    },
    [dispatch],
  );

  const walletConnectCheck = useCallback(
    async (currentTarget) => {
      if (isUnlockWithWalletConnect() && !wcClient.connected()) {
        const uri = await wcClient.startSession(false);

        dispatch(setWalletConnectURI(uri));
        dispatch(setTriggerElement(currentTarget));
        return true;
      }
      return false;
    },
    [dispatch, wcClient],
  );

  const getTargetOrders = useCallback(
    (side?: SideType) => {
      if (!side) return order;

      let sideNum = 0;
      if (side === 'buy') sideNum = 1;
      if (side === 'sell') sideNum = 2;

      return order.filter((item: OpenOrderType) => item.side === sideNum);
    },
    [order],
  );

  const prepareOrders = useCallback(
    (side?: SideType) => async (ev: React.MouseEvent<HTMLInputElement>) => {
      const { currentTarget } = ev;
      setTargetOrders(getTargetOrders(side));

      let noResultMessage = <FormattedMessage id="openOrders.noOpenOrders" />;
      if (side === 'buy') noResultMessage = <FormattedMessage id="openOrders.noBuyOpenOrders" />;
      if (side === 'sell') noResultMessage = <FormattedMessage id="openOrders.noSellOpenOrders" />;

      if (getTargetOrders(side).length === 0) {
        createToast(
          <Toast icon={<Toast.Icon.Danger />}>
            <ToastContainer>
              <ToastDescription>{noResultMessage}</ToastDescription>
            </ToastContainer>
          </Toast>,
        );
        return;
      }

      if (await walletConnectCheck(currentTarget)) return;

      if (!privateKey) {
        dispatch(setTriggerElement(currentTarget));
        dispatch(setNeedAuth(true));
        return;
      }

      setOpen(true);
    },
    [dispatch, getTargetOrders, privateKey, walletConnectCheck],
  );

  const cancelOrders = useCallback(async () => {
    const account = (await httpRequest.getAccount(address)) || {};

    privateKey !== 'HARDWARE' && (await bncClient.setPrivateKey(privateKey));

    try {
      if (!isExtensionWallet) dispatch(setLoading(true));

      let msg = <FormattedMessage id="openOrders.cancelSuccess" />;

      const newCancelled = new Set();
      let copied = [...order];

      for (let i = 0, len = targetOrders.length; i < len; i++) {
        const { symbol, pair, orderId } = targetOrders[i];
        const res = await bncClient.cancelOrder(
          address,
          symbol || pair,
          orderId,
          account.sequence + i,
        );

        if (res) {
          newCancelled.add(orderId);
          setOpen(false);
        } else {
          msg = <FormattedMessage id="openOrders.cancelPartialSuccess" />;
          break;
        }
      }

      copied = copied.filter((el) => !newCancelled.has(el.orderId));

      dispatch(setLoading(false));
      dispatch(setOpenOrder({ order: copied }));

      createToast(
        <Toast icon={<Toast.Icon.Success />}>
          <ToastContainer>
            <ToastDescription>{msg}</ToastDescription>
          </ToastContainer>
        </Toast>,
      );

      // updateOpenOrders();
    } catch (err) {
      dispatch(setLoading(false));
      createToast(
        <Toast icon={<Toast.Icon.Danger />}>
          <ToastContainer>
            <ToastDescription>
              {err.message || err || <FormattedMessage id="common.networkError" />}
            </ToastDescription>
          </ToastContainer>
        </Toast>,
      );
    }
  }, [address, bncClient, dispatch, isExtensionWallet, order, privateKey, targetOrders]);

  const cancelSingleOrder = useCallback(
    (order: OpenOrderType) => async (ev: React.MouseEvent<HTMLInputElement>) => {
      ev.preventDefault();
      const { currentTarget } = ev;

      if (await walletConnectCheck(currentTarget)) return;

      if (!privateKey) {
        dispatch(setTriggerElement(currentTarget));
        dispatch(setNeedAuth(true));
        return;
      }

      setTargetOrders([order]);
      setOpen(true);
    },
    [dispatch, privateKey, walletConnectCheck],
  );

  const data = useMemo(
    () =>
      order
        .filter((el: OpenOrderType) => (hideOtherPairs ? el.symbol === currentTrade : el))
        .map((order: OpenOrderType) => ({
          txHash: order.transactionHash,
          date: order.orderCreateTime,
          pair: order.symbol,
          side: order.side === 1 ? 'Buy' : 'Sell',
          price: roundValue(order.price),
          amount: roundValue(order.quantity),
          cumulateQuantity: order.cumulateQuantity,
          filled: `${(order.cumulateQuantity / order.quantity) * 100}%`,
          total: roundValue(order.price * order.quantity),
          op: '',
          orderId: order.orderId,
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
        Cell: ({ value }: CellValue) => (
          <>{`${reduceTradePairBSuffix(value).split('_').join(' / ')}`}</>
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
        Header: <FormattedMessage id="exchange.amount" />,
        accessor: 'amount',
      } as const,
      {
        Header: <FormattedMessage id="exchange.filled" />,
        accessor: 'filled',
      } as const,
      {
        Header: <FormattedMessage id="exchange.notional" />,
        accessor: 'total',
      } as const,
      {
        accessor: 'cancel',
        Cell: ({ row }: CellValue) =>
          hasPrivateKey() ? (
            <Button htmlTag="a" variant="link" href="#" onClick={cancelSingleOrder(row.original)}>
              <FormattedMessage id="common.cancel" />
            </Button>
          ) : null,
      } as const,
    ],
    [cancelSingleOrder],
  );

  const prevTrade = useRef(currentTrade).current;

  useEffect(() => {
    if (prevTrade === currentTrade) return;
    updateOpenOrders();
  }, [currentTrade, prevTrade, symbol, updateOpenOrders]);

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
          {isSm ? (
            <Dropdown
              target={
                <DefaultTarget>
                  <FormattedMessage id="openOrders.cancelAll" />
                </DefaultTarget>
              }
            >
              <Dropdown.Item key="all" onClick={prepareOrders()}>
                <FormattedMessage id="openOrders.cancelAll" />
              </Dropdown.Item>
              <Dropdown.Item key="buy" onClick={prepareOrders('buy')}>
                <FormattedMessage id="openOrders.cancelBuy" />
              </Dropdown.Item>
              <Dropdown.Item key="sell" onClick={prepareOrders('sell')}>
                <FormattedMessage id="openOrders.cancelSell" />
              </Dropdown.Item>
            </Dropdown>
          ) : (
            <>
              <Button onClick={prepareOrders()} variant="secondary" size="increased" shape="fit">
                <FormattedMessage id="openOrders.cancelAll" />
              </Button>
              <Space size="tiny" />
              <Button
                onClick={prepareOrders('buy')}
                variant="secondary"
                size="increased"
                shape="fit"
              >
                <FormattedMessage id="openOrders.cancelBuy" />
              </Button>
              <Space size="tiny" />
              <Button
                onClick={prepareOrders('sell')}
                variant="secondary"
                size="increased"
                shape="fit"
              >
                <FormattedMessage id="openOrders.cancelSell" />
              </Button>
            </>
          )}
        </RightFilter>
      </Filters>
      {isSm ? (
        <SmallerTable
          data={data}
          columns={columns}
          accessors={['amount', 'price', 'total', 'txHash', 'date']}
          cancellable={cancelSingleOrder}
          useFilledValue={true}
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
      <Confirm open={open} onClose={() => setOpen(false)} onConfirm={cancelOrders} />
    </TableContainer>
  );
};
