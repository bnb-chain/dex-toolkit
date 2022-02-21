import { useMemo, useCallback, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { CellValue } from 'react-table';
import { FormattedMessage } from 'react-intl';
import { useTheme } from 'styled-components';
import { Space, HoneycombThemeType } from '@binance-chain/honeycomb';

import { roundValue, formatNumber, decimalPlaces } from '@dex-kit/utils/number';
import { useWindowSize, useAppDispatch, useAppSelector } from '@dex-kit/hooks';
import { getAccount } from '@dex-kit/store/account';

import { Empty } from '../Empty';
import { SmallerTable } from '../SmallerTable';

import { StyledTable, TableContainer, Filters, LeftFilter } from '../styled';

import { Total, EstimatedValue } from './styled';

export const Balances = () => {
  const {
    account: {
      address,
      userInfo: { balances },
    },
    exchange: { cryptoCurrencyRate, tokens, currentTrade },
    tradePairs: { pairs },
    tickers: { symbolTickers },
  } = useAppSelector((state) => state);

  const dispatch = useAppDispatch();

  const { isSm } = useWindowSize();

  const theme = useTheme() as HoneycombThemeType;

  const { symbol } = useParams<{ symbol: string }>();

  const getLastPrice = useCallback(
    (baseAsset, quoteAsset = 'BNB') => {
      const ticker = symbolTickers.find((st) => st.symbol === `${baseAsset}_${quoteAsset}`);
      const pair = pairs.find(
        (p) => p.base_asset_symbol === baseAsset && p.quote_asset_symbol === quoteAsset,
      );
      let lastPrice;
      if (ticker) {
        lastPrice = parseFloat(ticker.price || 0);
      } else if (pair) {
        lastPrice = parseFloat(pair.price || 0);
      } else {
        const quoteTicker = symbolTickers.find((st) => st.symbol === `${quoteAsset}_${baseAsset}`);
        if (quoteTicker) {
          lastPrice = quoteTicker.price > 0 ? 1 / parseFloat(quoteTicker.price) : 0;
        } else {
          const quotePair =
            pairs.find(
              (p) => p.base_asset_symbol === quoteAsset && p.quote_asset_symbol === baseAsset,
            ) || {};
          lastPrice = quotePair.price > 0 ? 1 / parseFloat(quotePair.price) : 0;
        }
      }

      return lastPrice;
    },
    [pairs, symbolTickers],
  );

  const data = useMemo(() => {
    const result = balances.map((balance) => {
      const token = tokens.find((item) => balance.symbol === item.symbol) || {};
      const { symbol } = token;

      if (!symbol) {
        return {
          asset: token.symbol,
          name: token.name,
          displayName: token.original_symbol,
          totalBalance: 0,
          availableBalance: 0,
          frozen: 0,
          inOrder: 0,
          BTCValue: 0,
          bnbValue: 0,
          usdtValue: 0,
        };
      }

      let availableBalance = 0;
      let inOrder = 0;
      let frozen = 0;
      if (balance) {
        availableBalance = parseFloat(balance.free);
        inOrder = parseFloat(balance.locked);
        frozen = parseFloat(balance.frozen);
        availableBalance = Number.isNaN(availableBalance) ? 0 : availableBalance;
        inOrder = Number.isNaN(inOrder) ? 0 : inOrder;
        frozen = Number.isNaN(frozen) ? 0 : frozen;
      }

      const totalBalance = availableBalance + inOrder + frozen;

      let bnbBtcPair = symbolTickers.find((st) => st.symbol.includes('BNB_BTC.B'));
      if (!bnbBtcPair) {
        bnbBtcPair =
          pairs.find(
            (p) => p.base_asset_symbol === 'BNB' && p.quote_asset_symbol.includes('BTC.B'),
          ) || {};
      }

      const lastPrice = symbol === 'BNB' ? 1 : getLastPrice(symbol);

      const bnbValue = symbol === 'BNB' ? totalBalance : lastPrice * totalBalance;

      let btcValue = symbol.includes('BTC.B')
        ? totalBalance
        : bnbValue * parseFloat(bnbBtcPair.price || 0);
      btcValue = Number(roundValue(btcValue));

      let usdtValue;
      if (btcValue === 0 && bnbValue > 0) {
        usdtValue = cryptoCurrencyRate.BNB_USDT ? bnbValue * cryptoCurrencyRate.BNB_USDT : '';
      } else {
        usdtValue = cryptoCurrencyRate.BTC_USDT ? btcValue * cryptoCurrencyRate.BTC_USDT : '';
      }

      return {
        asset: symbol,
        name: token.name,
        displayName: token.original_symbol,
        totalBalance: totalBalance < 0.000001 ? totalBalance.toFixed(8) : totalBalance,
        availableBalance:
          availableBalance < 0.000001 ? availableBalance.toFixed(8) : availableBalance,
        frozen: frozen < 0.000001 ? frozen.toFixed(8) : frozen,
        inOrder: inOrder < 0.000001 ? inOrder.toFixed(8) : inOrder,
        BTCValue: btcValue,
        bnbValue,
        usdtValue,
      };
    });

    return result.sort((a, b) => a?.asset?.localeCompare(b.asset));
  }, [
    balances,
    cryptoCurrencyRate.BNB_USDT,
    cryptoCurrencyRate.BTC_USDT,
    getLastPrice,
    pairs,
    symbolTickers,
    tokens,
  ]);

  const columns = useMemo(
    () => [
      {
        Header: <FormattedMessage id="exchange.asset" />,
        accessor: 'asset',
      } as const,
      {
        Header: <FormattedMessage id="exchange.name" />,
        accessor: 'name',
      } as const,
      {
        Header: <FormattedMessage id="exchange.totalBalance" />,
        accessor: 'totalBalance',
        Cell: ({ value }: CellValue) => <>{formatNumber(value, decimalPlaces(value))}</>,
      } as const,
      {
        Header: <FormattedMessage id="exchange.availableBalance" />,
        accessor: 'availableBalance',
        Cell: ({ value }: CellValue) => <>{formatNumber(value, decimalPlaces(value))}</>,
      } as const,
      {
        Header: <FormattedMessage id="exchange.frozen" />,
        accessor: 'frozen',
        Cell: ({ value }: CellValue) => <>{formatNumber(value, decimalPlaces(value))}</>,
      } as const,
      {
        Header: <FormattedMessage id="exchange.inOrder" />,
        accessor: 'inOrder',
        Cell: ({ value }: CellValue) => <>{formatNumber(value, decimalPlaces(value))}</>,
      } as const,
      {
        Header: <FormattedMessage id="exchange.BTCValue" />,
        accessor: 'BTCValue',
        Cell: ({ value }: CellValue) => <>{formatNumber(value, decimalPlaces(value))}</>,
      } as const,
    ],
    [],
  );

  const updateBalances = useCallback(() => {
    dispatch(getAccount(address));
  }, [address, dispatch]);

  const totalBTCValue = useMemo(
    () => roundValue(data.reduce((n, pre) => parseFloat(n) + parseFloat(pre.BTCValue), 0)),
    [data],
  );

  const totalBNBValue = useMemo(
    () => roundValue(data.reduce((n, pre) => n + parseFloat(pre.bnbValue), 0)),
    [data],
  );

  const totalUsd = useMemo(() => {
    const val = data.reduce((n, pre) => n + parseFloat(pre.usdtValue), 0);
    return cryptoCurrencyRate
      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)
      : val;
  }, [cryptoCurrencyRate, data]);

  const prevTrade = useRef(currentTrade).current;

  useEffect(() => {
    if (prevTrade === currentTrade && balances.length > 0) return;
    updateBalances();
  }, [currentTrade, prevTrade, symbol, balances.length, updateBalances]);

  return (
    <TableContainer>
      <Filters>
        <LeftFilter>
          <EstimatedValue>
            <FormattedMessage id="exchange.estimatedValue" />:
            <Space size="micro" />
            {totalBTCValue === 0 ? (
              <>
                <Total>
                  {formatNumber(Number(totalBNBValue), decimalPlaces(Number(totalBNBValue)))}
                  BNB
                </Total>
                <Space size="micro" />
                /
                <Space size="micro" />
              </>
            ) : (
              <>
                <Total>
                  {formatNumber(Number(totalBTCValue), decimalPlaces(Number(totalBTCValue)))}
                  BTC
                </Total>
                <Space size="micro" />
                /
                <Space size="micro" />
              </>
            )}
            <Total>{totalUsd}</Total>
          </EstimatedValue>
        </LeftFilter>
      </Filters>
      {isSm ? (
        <SmallerTable
          data={data}
          columns={columns}
          accessors={['totalBalance', 'availableBalance', 'frozen', 'inOrder', 'BTCValue']}
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
