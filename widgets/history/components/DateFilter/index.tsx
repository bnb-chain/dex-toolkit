import { useState, useEffect, useCallback, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';
import { Button, Space, Dropdown } from '@binance-chain/honeycomb';
import is from 'is_js';

import { useWindowSize, useAppSelector } from '@dex-kit/hooks';

import { DefaultTarget } from '../styled';

export const DateFilter = ({ onFilterChange }: { onFilterChange: Function }) => {
  const {
    exchange: { currentTrade },
  } = useAppSelector((state) => state);

  const { isSm } = useWindowSize();

  const { symbol } = useParams<{ symbol: string }>();

  const [manualStartDate, setManualStartDate] = useState('');
  const [manualEndDate, setManualEndDate] = useState('');
  const [period, setPeriod] = useState('1d');

  const resetManualDates = useCallback(() => {
    setManualStartDate('');
    setManualEndDate('');
  }, []);

  const search = useCallback(
    (opts = {}) => {
      if (!is.existy(manualStartDate) || !is.existy(manualEndDate)) return;
      let params = {} as { [key: string]: string };
      if (is.date(manualStartDate)) {
        params = { ...params, manualStartDate };
      }

      if (is.date(manualEndDate)) {
        params = { ...params, manualEndDate };
      }

      onFilterChange && onFilterChange({ ...params, ...opts });
    },
    [manualEndDate, manualStartDate, onFilterChange],
  );

  const setTab = useCallback(
    (val) => (ev: React.MouseEvent<HTMLInputElement>) => {
      if (ev && ev.target && val === period) return;
      const date = new Date();
      const end = date.setHours(24, 0, 0, 0);
      let start: number;
      switch (val) {
        case '3m':
          start = date.setMonth(date.getMonth() - 3);
          break;
        case '1m':
          start = date.setMonth(date.getMonth() - 1);
          break;
        case '1w':
          start = date.setDate(date.getDate() - 7);
          break;
        case '1d':
        default:
          start = date.setDate(date.getDate() - 1);
          break;
      }
      if (val !== '1d') start = date.setDate(date.getDate() - 1);
      setPeriod(val);
      search({ start, end });
    },
    [period, search],
  );

  const prevTrade = useRef(currentTrade).current;

  useEffect(() => {
    if (prevTrade === symbol) return;
    resetManualDates();
  }, [prevTrade, resetManualDates, symbol]);

  return (
    <>
      {isSm ? (
        <>
          <Dropdown
            target={
              <DefaultTarget>
                {period === '1d' && <FormattedMessage id="exchange.oneDay" />}
                {period === '1w' && <FormattedMessage id="exchange.oneWeek" />}
                {period === '1m' && <FormattedMessage id="exchange.oneMonth" />}
                {period === '3m' && <FormattedMessage id="exchange.threeMonths" />}
              </DefaultTarget>
            }
          >
            <Dropdown.Item key="1d" onClick={setTab('1d')}>
              <FormattedMessage id="exchange.oneDay" />
            </Dropdown.Item>
            <Dropdown.Item key="1w" onClick={setTab('1w')}>
              <FormattedMessage id="exchange.oneWeek" />
            </Dropdown.Item>
            <Dropdown.Item key="1m" onClick={setTab('1m')}>
              <FormattedMessage id="exchange.oneMonth" />
            </Dropdown.Item>
            <Dropdown.Item key="3m" onClick={setTab('3m')}>
              <FormattedMessage id="exchange.threeMonths" />
            </Dropdown.Item>
          </Dropdown>
        </>
      ) : (
        <>
          <Button
            onClick={setTab('1d')}
            variant={period === '1d' ? 'primary' : 'secondary'}
            size="increased"
            shape="fit"
          >
            <FormattedMessage id="exchange.oneDay" />
          </Button>
          <Space size="tiny" />
          <Button
            onClick={setTab('1w')}
            variant={period === '1w' ? 'primary' : 'secondary'}
            size="increased"
            shape="fit"
          >
            <FormattedMessage id="exchange.oneWeek" />
          </Button>
          <Space size="tiny" />
          <Button
            onClick={setTab('1m')}
            variant={period === '1m' ? 'primary' : 'secondary'}
            size="increased"
            shape="fit"
          >
            <FormattedMessage id="exchange.oneMonth" />
          </Button>
          <Space size="tiny" />
          <Button
            onClick={setTab('3m')}
            variant={period === '3m' ? 'primary' : 'secondary'}
            size="increased"
            shape="fit"
          >
            <FormattedMessage id="exchange.threeMonths" />
          </Button>
        </>
      )}
    </>
  );
};
