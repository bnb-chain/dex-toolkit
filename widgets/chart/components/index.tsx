import { useState, useMemo, useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { useTheme } from 'styled-components';
import { Button, Dropdown, Space, HoneycombThemeType } from '@binance-chain/honeycomb';

import { useAppSelector, useWindowSize } from '@dex-kit/hooks';
import { getIntervals } from '@dex-kit/utils/chart';
import { Icon } from '@dex-kit/utils/icons';

import { TradingView } from './TradingView';
import { Depth } from './Depth';

import { Container, PanelContainer, Left, Right, DefaultTarget, StyledUnionButton } from './styled';

const TRADINGVIEW_VIEW_NAME = 'TradingView';
const CHART_INTERVALS = getIntervals();
const DEFAULT_INTERVAL_NAME = '1h';
const DEFAULT_INTERVAL = CHART_INTERVALS[DEFAULT_INTERVAL_NAME];
const CHART_INTERVALS_INV = {};
Object.keys(CHART_INTERVALS).forEach((k) => {
  CHART_INTERVALS_INV[CHART_INTERVALS[k]] = k;
});

const DEPTH_VIEW_NAME = 'depth';
const DEFAULT_VIEW_NAME = TRADINGVIEW_VIEW_NAME;

const DEFAULT_CHART_LINE_TYPE = 'Candle';

export const Main = () => {
  const {
    exchange: { currentTrade },
    tradePairs: { pairs },
  } = useAppSelector((state) => state);

  const { isSm } = useWindowSize();

  const theme = useTheme() as HoneycombThemeType;

  const [fullscreen, setFullscreen] = useState(false);
  const [indicatorShowTV, setIndicatorShowTV] = useState(false);
  const [intervalName, setIntervalName] = useState('1h');
  const [interval, setInterval] = useState(DEFAULT_INTERVAL);
  const [selectedView, setSelectedView] = useState(DEFAULT_VIEW_NAME);
  const [lineType, setLineType] = useState(DEFAULT_CHART_LINE_TYPE);

  const symbols = useMemo(
    () =>
      pairs.map((pair) => ({
        symbol: `${pair.base_asset_symbol}_${pair.quote_asset_symbol}`,
        tickSize: pair.tick_size,
      })),
    [pairs],
  );

  const handleInterval = useCallback(({ key, type }) => {
    if (!key) return;
    const newType = type || 'Candle';
    const value = key;
    const newInterval = parseInt(value, 10);
    const newIntervalName = CHART_INTERVALS_INV[value];

    setInterval(newInterval);
    setIntervalName(newIntervalName);
    setLineType(newType);

    if (!window.localStorage) return;
    window.localStorage.setItem('bn.lineType', newType);
    window.localStorage.setItem('bn.interval', newInterval);
    window.localStorage.setItem('bn.intervalName', newIntervalName);
  }, []);

  const handleViewChange = useCallback(
    (newView) => (event) => {
      event.preventDefault();
      setSelectedView(newView);
      window.localStorage.setItem('bn.selectedView', newView);
    },
    [],
  );

  return (
    <Container fullscreen={fullscreen}>
      <PanelContainer>
        {selectedView === TRADINGVIEW_VIEW_NAME && (
          <Left>
            <Button
              variant={intervalName === '1m' && lineType === 'Line' ? 'primary' : 'secondary'}
              onClick={() => handleInterval({ key: CHART_INTERVALS['1m'], type: 'Line' })}
              onKeyDown={() => handleInterval({ key: CHART_INTERVALS['1m'], type: 'Line' })}
              size="increased"
              shape="fit"
            >
              Time
            </Button>
            <Space size="micro" />
            {isSm ? (
              <>
                <Dropdown
                  target={
                    <DefaultTarget
                      active={intervalName.endsWith('m') && lineType !== 'Line'}
                      shape="fit"
                    >
                      {intervalName}
                    </DefaultTarget>
                  }
                >
                  {Object.keys(CHART_INTERVALS).map((el, index) => (
                    <>
                      <Dropdown.Item
                        key={`option-${el}-${index + 1}`}
                        onClick={() => handleInterval({ key: CHART_INTERVALS[el], type: 'Candle' })}
                        selected={el === intervalName && lineType !== 'Line'}
                      >
                        {el}
                      </Dropdown.Item>
                    </>
                  ))}
                </Dropdown>
              </>
            ) : (
              <>
                <Dropdown
                  target={
                    <DefaultTarget
                      active={intervalName.endsWith('m') && lineType !== 'Line'}
                      shape="fit"
                    >
                      {intervalName.endsWith('m') ? intervalName : '1m'}
                    </DefaultTarget>
                  }
                >
                  {Object.keys(CHART_INTERVALS)
                    .filter((_interval) => _interval.endsWith('m'))
                    .map((el, index) => (
                      <>
                        <Dropdown.Item
                          key={`option-${el}-${index + 1}`}
                          onClick={() =>
                            handleInterval({ key: CHART_INTERVALS[el], type: 'Candle' })
                          }
                          selected={el === intervalName && lineType !== 'Line'}
                        >
                          {el}
                        </Dropdown.Item>
                      </>
                    ))}
                </Dropdown>
                <Space size="micro" />
                <Dropdown
                  target={
                    <DefaultTarget active={intervalName.endsWith('h')} shape="fit">
                      {intervalName.endsWith('h') ? intervalName : '1h'}
                    </DefaultTarget>
                  }
                >
                  {Object.keys(CHART_INTERVALS)
                    .filter((_interval) => _interval.endsWith('h'))
                    .map((el, index) => (
                      <>
                        <Dropdown.Item
                          key={`option-${el}-${index + 1}`}
                          onClick={() =>
                            handleInterval({ key: CHART_INTERVALS[el], type: 'Candle' })
                          }
                          selected={el === intervalName}
                        >
                          {el}
                        </Dropdown.Item>
                      </>
                    ))}
                </Dropdown>
                <Space size="micro" />
                <Button
                  variant={intervalName === '1d' ? 'primary' : 'secondary'}
                  onClick={() => handleInterval({ key: CHART_INTERVALS['1d'], type: 'Candle' })}
                  onKeyDown={() => handleInterval({ key: CHART_INTERVALS['1d'], type: 'Candle' })}
                  size="increased"
                  shape="fit"
                >
                  1D
                </Button>
                <Space size="micro" />
                <Button
                  variant={intervalName === '1w' ? 'primary' : 'secondary'}
                  onClick={() => handleInterval({ key: CHART_INTERVALS['1w'], type: 'Candle' })}
                  onKeyDown={() => handleInterval({ key: CHART_INTERVALS['1w'], type: 'Candle' })}
                  size="increased"
                  shape="fit"
                >
                  1W
                </Button>
                <Space size="micro" />
                <Button
                  variant={intervalName === '1M' ? 'primary' : 'secondary'}
                  onClick={() => handleInterval({ key: CHART_INTERVALS['1M'], type: 'Candle' })}
                  onKeyDown={() => handleInterval({ key: CHART_INTERVALS['1M'], type: 'Candle' })}
                  size="increased"
                  shape="fit"
                >
                  1M
                </Button>
              </>
            )}
          </Left>
        )}
        <Right>
          <Button
            variant={selectedView === DEFAULT_VIEW_NAME ? 'primary' : 'secondary'}
            onClick={handleViewChange(DEFAULT_VIEW_NAME)}
            onKeyDown={handleViewChange(DEFAULT_VIEW_NAME)}
            size="increased"
            shape="fit"
          >
            TradingView
          </Button>
          <Space size="micro" />
          <Button
            variant={selectedView === DEPTH_VIEW_NAME ? 'primary' : 'secondary'}
            onClick={handleViewChange(DEPTH_VIEW_NAME)}
            onKeyDown={handleViewChange(DEPTH_VIEW_NAME)}
            size="increased"
            shape="fit"
          >
            <FormattedMessage id="exchange.chartbox.depth" />
          </Button>
          <Space size="micro" />
          <StyledUnionButton
            variant={fullscreen ? 'primary' : 'secondary'}
            onClick={() => setFullscreen(!fullscreen)}
            onKeyDown={() => setFullscreen(!fullscreen)}
            size="increased"
            shape="fit"
          >
            <Icon.Union fill={theme.honeycomb.color.text.normal} />
          </StyledUnionButton>
        </Right>
      </PanelContainer>
      <Space size="small" />
      <TradingView
        hidden={selectedView !== TRADINGVIEW_VIEW_NAME}
        fullscreen={fullscreen}
        selectedView={selectedView}
        showIndicatorsDialog={indicatorShowTV}
        symbol={currentTrade}
        interval={interval}
        lineType={lineType}
        symbols={symbols}
      />
      <Depth
        hidden={selectedView !== DEPTH_VIEW_NAME}
        selectedView={selectedView}
        fullscreen={fullscreen}
        interval={interval}
      />
    </Container>
  );
};
