import { useState, useMemo, useCallback, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { CellValue, SortingRule } from 'react-table';
import { useIntl, FormattedMessage } from 'react-intl';
import { useTheme } from 'styled-components';
import { HoneycombThemeType, Space } from '@binance-chain/honeycomb';

import { percentage } from '@dex-kit/utils/number';
import { TOKEN_TYPE_BEP2, getTokenType } from '@dex-kit/utils/tokenTypes';
import { getInitialFavorites } from '@dex-kit/utils/favorites';
import { Icon } from '@dex-kit/utils/icons';
import { useAppDispatch, useAppSelector } from '@dex-kit/hooks';
import { setCurrentTrade, setAmount, setCurrentPrice } from '@dex-kit/store/exchange/action';
import { setFavorites } from '@dex-kit/store/tradePairs';
import { setTradeHistory } from '@dex-kit/store/trade';
import { getDepth } from '@dex-kit/store/orderbooks';

import { StyledTable, TableContainer, Positive, Negative, PairContainer, Setter } from './styled';

export const Filtered = ({ data, checkedValue }: { data: any; checkedValue: string }) => {
  const [sortBy, setSortBy] = useState([] as Array<SortingRule<Object>>);
  const {
    exchange: { currentTrade },
    tradePairs: { favorites },
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const { locale } = useIntl();
  const { tradePath } = useParams<{ tradePath: string }>();
  const history = useHistory();
  const theme = useTheme() as HoneycombThemeType;

  const handleFavorite = useCallback(
    (item) => (ev) => {
      ev.stopPropagation();

      const copy = [...favorites];
      if (!copy.find((f) => f === item.key)) {
        copy.push(item.key);
      } else {
        for (let i = 0, len = copy.length; i < len; i++) {
          if (copy[i] === item.key) {
            copy.splice(i, 1);
          }
        }
      }

      dispatch(setFavorites(copy));
    },
    [dispatch, favorites],
  );

  const BASE_COLUMNS = useMemo(
    () => [
      {
        Header: <FormattedMessage id="exchange.tradingPair.pair" />,
        accessor: 'base_asset_displayname',
        defaultCanSort: true,
        sortType: 'basic',
        Cell: ({ row, value }: CellValue) => {
          const { original: item } = row;
          const filled = favorites.find((f) => f === item.key);
          return (
            <PairContainer>
              <Setter onClick={handleFavorite(row.original)}>
                <Icon.Star
                  fill={
                    filled
                      ? theme.honeycomb.color.primary.normal
                      : theme.honeycomb.color.text.masked
                  }
                />
              </Setter>
              <Space size="tiny" />
              <span>
                {value}/{row.original.quote_asset_displayname}
              </span>
            </PairContainer>
          );
        },
      } as const,
      {
        Header: <FormattedMessage id="exchange.tradingPair.price" />,
        accessor: 'priceForSorting',
        defaultCanSort: true,
        sortType: 'basic',
        Cell: ({ row }: CellValue) => <>{row.original.price}</>,
      } as const,
    ],
    [
      favorites,
      handleFavorite,
      theme.honeycomb.color.primary.normal,
      theme.honeycomb.color.text.masked,
    ],
  );

  const columns = useMemo(() => {
    let base = [...BASE_COLUMNS];
    let columns = [];
    if (checkedValue === 'change') {
      columns = [
        ...base,
        {
          Header: <FormattedMessage id="exchange.tradingPair.change" />,
          accessor: 'change',
          defaultCanSort: true,
          sortType: 'basic',
          Cell: ({ value }: CellValue) => {
            if (value >= 0) {
              return (
                <Positive>
                  {value > 0 ? '+' : ''}
                  {`${percentage(parseFloat(value), 1)}`}
                </Positive>
              );
            }
            return <Negative>-{percentage(parseFloat(value), 1)}</Negative>;
          },
        } as const,
      ];
    } else {
      columns = [
        ...base,
        {
          Header: <FormattedMessage id="exchange.tradingPair.volume" />,
          accessor: 'volumeForSorting',
          defaultCanSort: true,
          sortType: 'basic',
          Cell: ({ row }: CellValue) => <>{row.original.volume}</>,
        } as const,
      ];
    }
    return columns;
  }, [BASE_COLUMNS, checkedValue]);

  const splitTrade = useCallback((newTrade) => {
    const result = newTrade.split('_');
    return { baseAsset: result[0], quoteAsset: result[1] };
  }, []);

  const selectCurrentTrade = useCallback(
    (item) => {
      const newTrade = `${item.base_asset_symbol}_${item.quote_asset_symbol}`;
      const tokenType = getTokenType();
      if (currentTrade === newTrade) return;

      const asset = splitTrade(newTrade);
      dispatch(setCurrentTrade(newTrade));
      dispatch(getDepth({ symbol: newTrade, limit: 20 }));
      dispatch(setTradeHistory({ trade: [] }));
      dispatch(setCurrentPrice(item.price));
      dispatch(setAmount({ buyAmount: '', sellAmount: '' }));
      const newUrl =
        tokenType === TOKEN_TYPE_BEP2
          ? `/${locale}/${tradePath}/${asset.baseAsset}_${asset.quoteAsset}`
          : `/${locale}/${tradePath}/mini/${asset.baseAsset}_${asset.quoteAsset}`;

      history.push(newUrl);
    },
    [currentTrade, dispatch, history, locale, splitTrade, tradePath],
  );

  useEffect(() => {
    Object.values(favorites).forEach((el) => {
      if (Array.isArray(el) && el.length === 0) {
        const favorites = getInitialFavorites();
        if (favorites) dispatch(setFavorites(favorites));
      }
    });
  }, [dispatch, favorites]);

  return (
    <TableContainer>
      <StyledTable
        header={{ fixed: true, background: theme.honeycomb.color.bg.normal }}
        data={data}
        columns={columns}
        interactive={true}
        onSort={(val) => {
          if (!val.sortBy || !Array.isArray(val.sortBy)) return;
          setSortBy(val.sortBy);
        }}
        sortBy={sortBy}
        onRowClick={({ data }) => selectCurrentTrade(data.original)}
      />
    </TableContainer>
  );
};
