// @ts-nocheck

import { useState, useCallback, useEffect, useRef } from 'react';
import { useIntl } from 'react-intl';
import { useTheme } from 'styled-components';

import * as TradingViewUtils from '@dex-kit/utils/tradingview';
import { getTradingViewLocale, SMARTLING_LOCALES } from '@dex-kit/utils/locales';
import { useInterval } from '@dex-kit/hooks';

import { GlobalStyle, TradingViewChartContainer } from './styled';

const TRADINGVIEW_VIEW_NAME = 'TradingView';

const TV_CONTAINER_ID = 'tradingview_4bca8';
const TV_CANDLE_SERIES = 1;
const TV_LINE_SERIES = 2;
const TV_INTERVAL = 100; // For setting trading view script.
const TV_MAX_LOAD_CHECKS = 50;

type Prop = {
  hidden: boolean;
  symbol: string;
  symbols: Array<string>;
  selectedView: string;
  fullscreen: boolean;
  interval: number;
  lineType: string;
  showIndicatorsDialog: boolean;
};

export const TradingView = ({
  hidden,
  symbol,
  symbols,
  interval,
  lineType,
  selectedView,
  showIndicatorsDialog,
  fullscreen,
}: Prop) => {
  const { locale } = useIntl();

  const [, setLoading] = useState(false);
  const [count, setCount] = useState(0);

  const theme = useTheme();

  let tv: any = useRef(null);
  let tvInterval: any = useRef(null);
  let tvSymbolTimeout: any = useRef(null);
  let tvStateTimeout: any = useRef(null);

  const resetTVInterval = useCallback(() => {
    clearInterval(tvInterval.current);
    tvInterval.current = null;
  }, []);

  const candleDefault = useCallback(() => {
    if (!tv.current) return;
    tv.current.chart().createStudy('Moving Average', false, false, [7], null, {
      'Plot.linewidth': 1,
      'Plot.color': theme.tradingViewStyle.ma1,
    });

    tv.current.chart().createStudy('Moving Average', false, false, [25], null, {
      'Plot.linewidth': 1,
      'Plot.color': theme.tradingViewStyle.ma2,
    });

    tv.current.chart().createStudy('Moving Average', false, false, [99], null, {
      'Plot.linewidth': 1,
      'Plot.color': theme.tradingViewStyle.ma3,
    });
  }, [theme.tradingViewStyle.ma1, theme.tradingViewStyle.ma2, theme.tradingViewStyle.ma3]);

  const lineDefault = useCallback(() => {
    tv.current.chart().removeAllStudies();
    tv.current.chart().createStudy('Volume', false, false, [99], null, null);
  }, []);

  const loadStudies = useCallback(
    (lineType, mode = theme.mode) => {
      if (!tv.current) return;
      if (localStorage['myTradingView' + mode + lineType]) {
        tv.current.load(JSON.parse(localStorage['myTradingView' + mode + lineType]));
      } else if (lineType !== 'Line') {
        candleDefault();
      } else if (lineType === 'Line') {
        lineDefault();
      }
    },
    [candleDefault, lineDefault, theme.mode],
  );

  const promptIndicatorsDialog = useCallback(() => {
    tv.current && tv.current.chart().executeActionById('insertIndicator');
  }, []);

  const init = useCallback(() => {
    if (!tv.current && selectedView === TRADINGVIEW_VIEW_NAME) {
      const tvInterval = TradingViewUtils.translateResolutionForTV(interval);

      tv.current = new window.TradingView.widget( // eslint-disable-line new-cap
        TradingViewUtils.generateTradingViewConfig({
          containerId: TV_CONTAINER_ID,
          symbol,
          symbols,
          interval: tvInterval,
          locale: getTradingViewLocale(SMARTLING_LOCALES[locale]) || 'en',
          theme,
        }),
      );

      setLoading(true);
      tv.current.onChartReady(() => {
        loadStudies(lineType);
        tvSymbolTimeout.current = setTimeout(() => {
          try {
            tv.current.setSymbol(symbol, tvInterval);
          } catch (err) {
            console.log(err);
          }
        }, 0);
        tv.current.applyOverrides(theme.tradingViewOverrides || {});

        if (lineType === 'Line') {
          tv.current.applyOverrides({ 'mainSeriesProperties.style': TV_LINE_SERIES });
        } else {
          tv.current.applyOverrides({ 'mainSeriesProperties.style': TV_CANDLE_SERIES });
        }

        tv.current
          .chart()
          .onDataLoaded()
          .subscribe(null, () => {
            tvStateTimeout.current = setTimeout(() => {
              setLoading(false);
            }, 0);
          });

        tv.current.subscribe('onAutoSaveNeeded', () => {
          tv.current.save((chartData: any) => {
            localStorage['myTradingView' + theme.mode + lineType] = JSON.stringify(chartData);
          });
        });
      });
    }
  }, [selectedView, interval, symbol, symbols, locale, theme, loadStudies, lineType]);

  useInterval(() => {
    if (!tv.current && window.TradingView) {
      resetTVInterval();
      if (document.getElementById(TV_CONTAINER_ID)) {
        init();
      } else {
        setCount(count + 1);
      }
    } else if (count > TV_MAX_LOAD_CHECKS) resetTVInterval(); // Give up
  }, TV_INTERVAL);

  useEffect(() => {
    if (!tv.current) return;

    if (lineType === 'Line') {
      tv.current.applyOverrides({ 'mainSeriesProperties.style': TV_LINE_SERIES });
    } else {
      tv.current.applyOverrides({ 'mainSeriesProperties.style': TV_CANDLE_SERIES });
    }

    loadStudies(lineType);

    return () => {
      try {
        clearTimeout(tvSymbolTimeout.current);
        clearTimeout(tvStateTimeout.current);
        tv.current && tv.current.remove();
        tv.current = undefined;
        tvSymbolTimeout.current = null;
        tvStateTimeout.current = null;
      } catch (err) {
        console.log(err);
      }
    };
  }, [loadStudies, lineType]);

  useEffect(() => {
    if (tv.current) {
      // tv.current && tv.current.remove();
      tv.current = undefined;
    }
  }, [locale, theme]);

  useEffect(() => {
    const tvInterval = TradingViewUtils.translateResolutionForTV(interval);
    if (tv.current) {
      try {
        if (tv.current.activeChart().resolution() !== tvInterval) {
          setLoading(true);
          tv.current.activeChart().setResolution(tvInterval);
          setLoading(false);
        }
      } catch (err) {
        console.log(err);
        tv.current && tv.current.remove();
        tv.current = undefined;
      }
    }
  }, [interval]);

  useEffect(() => {
    if (tv.current) {
      try {
        setLoading(true);
        tv.current.chart().setSymbol(symbol);
        setLoading(false);
      } catch (err) {
        console.log(err);
        // tv.current && tv.current.remove();
        tv.current = undefined;
      }
    }
  }, [symbol]);

  useEffect(() => promptIndicatorsDialog(), [promptIndicatorsDialog, showIndicatorsDialog]);

  return (
    <>
      <TradingViewChartContainer
        hidden={selectedView !== TRADINGVIEW_VIEW_NAME}
        fullscreen={fullscreen}
      >
        <div className="tradingview-widget-container">
          <div ref={tv.current} id={TV_CONTAINER_ID}>
            TradingView is loading&hellip;
          </div>
        </div>
      </TradingViewChartContainer>
      <GlobalStyle />
    </>
  );
};
