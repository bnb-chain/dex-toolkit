/* eslint-disable */
import Fetch from 'fetch-ponyfill';

import WebSocket from '../network/WebSocket';
import { getTradingViewLocale, SMARTLING_LOCALES } from '../locales';
import httpRequest from '../httpRequest';
import { isMobile } from '../bomUtils';
import { TOKEN_TYPE_BEP2, getTokenType } from '../tokenTypes';

const { fetch } = Fetch();

const WS_PATH = '/stream?streams=';
const EXCHANGE_TIMEZONE = 'Asia/Shanghai';
const SERVERTIME_API_PATH = '/api/v1/time';
const GATE_WAY = httpRequest.getHttpBaseUri();
const WSS_URI = httpRequest.getWSSBaseUri();
const REST_BASE_URI = GATE_WAY;
const WSS_STREAM_URI = `${WSS_URI}ws/`;

const TV_RESOLUTIONS_TO_BINANCE = {
  1: '1m',
  3: '3m',
  5: '5m',
  15: '15m',
  30: '30m',
  60: '1h',
  120: '2h',
  240: '4h',
  360: '6h',
  720: '12h',
  D: '1d',
  '1W': '1w',
  '1M': '1M',
};

const convertKlineArrToBar = (arr) => {
  if (!Array.isArray(arr)) return;

  arr = arr.map((num) => +num);
  const [time, open, high, low, close, volume] = arr;
  return {
    time,
    close,
    open,
    high,
    low,
    volume,
  };
};

const convertKlineObjToBar = ({ k: kline }) => {
  const { t, l, c, h, o, v } = kline;
  return {
    time: t,
    close: +c,
    open: +o,
    high: +h,
    low: +l,
    volume: +v,
  };
};

export const translateResolutionForBinance = (resolution) => TV_RESOLUTIONS_TO_BINANCE[resolution];

export const translateResolutionForTV = (secs) => {
  const intervalMins = (secs / 60).toString();
  let tvInterval = intervalMins;
  if (intervalMins === '1440') {
    // 1d
    tvInterval = 'D';
  } else if (intervalMins === '10080') {
    // 1w
    tvInterval = '1W';
  } else if (intervalMins === '43200') {
    // 1w
    tvInterval = '1M';
  }
  return tvInterval;
};

export class DataFeed {
  constructor(symbols = [], baseUri = REST_BASE_URI) {
    this.symbols = symbols;
    this.baseUri = baseUri;
    this.sockets = new Map();
  }

  // ### onReady(callback)
  // `callback`: function(configurationData)
  //     `configurationData`: object (see below)
  //          exchanges
  //          symbols_types
  //          supported_resolutions
  //          supports_marks
  //          supports_timescale_marks
  //          supports_time
  //          futures_regex
  onReady = (callback) => {
    setTimeout(() => {
      callback({
        exchanges: [],
        symbols_types: [],
        supported_resolutions: Object.keys(TV_RESOLUTIONS_TO_BINANCE),
        supports_marks: false, // TODO: maybe
        supports_timescale_marks: false, // TODO: maybe
        supports_time: true,
      });
    }, 0);
  };

  // ### resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback)
  // `symbolName`: string. Symbol name or `ticker` if provided.
  // `onSymbolResolvedCallback`: function([SymbolInfo](Symbology#symbolinfo-structure))
  // `onResolveErrorCallback`: function(reason)
  // Charting Library calls this fn when it needs [SymbolInfo](Symbology#symbolinfo-structure)
  // by symbol name.
  resolveSymbol = (symbol, callback, errorCallback) => {
    if (window.__DEV__) {
      console.log('resolveSymbol called with:', symbol);
    }
    symbol = symbol.replace('BINANCE:', '');
    const matches = this.symbols.filter(({ symbol: symb }) => symb === symbol);
    if (!matches.length) {
      errorCallback('not found');
      return;
    }
    const match = matches[0];
    // const symbolFilter = match.filters.find((filter) => filter.tickSize || filter.stepSize);
    const { tickSize } = match;
    const resolved = {
      description: match.symbol.replace(/-[A-F0-9]+/g, '').replace('_', '/'),
      fractional: false, // `fractional` for common prices is `false` or it can be skipped.
      has_intraday: true,
      minmov: 1, // `minmov` is a number of units that make up one tick.
      minmove2: 0, // `minmove2` for common prices is `0` or it can be skipped.
      name: match.symbol,
      // `pricescale` defines number of decimal places.
      // Actually it is `10^number-of-decimal-places`.
      pricescale: 10 ** Math.abs(Math.log10(tickSize)),
      session: '24x7',
      timezone: EXCHANGE_TIMEZONE,
      type: 'crypto',
      // volume_precision: 2,
    };
    if (window.__DEV__) {
      console.log('resolved symbol:', resolved);
    }
    // TODO: fill this out properly
    setTimeout(() => {
      callback(resolved);
    }, 0);
  };

  // ### getBars(symbolInfo, resolution, from, to, onHistoryCallback,
  //              onErrorCallback, firstDataRequest)
  // `symbolInfo`: [SymbolInfo](Symbology#symbolinfo-structure) object
  // `resolution`: string
  // `from`: unix timestamp, leftmost required bar time
  // `to`: unix timestamp, rightmost required bar time
  // `onHistoryCallback`: function(array of `bar`s, `meta` = `{ noData = false }`)
  //     `bar`: object `{time, close, open, high, low, volume}`
  //     `meta`: object `{noData = true | false, nextTime - unix time}`
  // `onErrorCallback`: function(reason)
  // `firstDataRequest`: boolean to identify the first call of this method for the
  //     particular symbol resolution.
  //     When it is set to `true` you can ignore `to` (which depends on browser's `Date.now()`)
  //     and return bars up to the latest bar.
  getBars = async ({ name: symbol }, resolution, from, to, callback, onError) => {
    const interval = translateResolutionForBinance(resolution);
    // this api is hard limited to return 300 bars max, regardless of `limit`
    const limit = 1000; // never more than 300!
    let lastCount = -1;
    let lastTime = from * 1000;
    let errored = false;
    const tokenType = getTokenType();
    const params = {
      symbol,
      interval,
      limit,
      endTime: to * 1000,
    };
    const bars = [];
    while (lastCount === -1 || lastCount === limit) {
      try {
        const isFirst = lastCount === -1;
        // +1 to not get duplicate bars
        if (isFirst) {
          params.startTime = lastTime;
        } else {
          params.startTime = lastTime + 1;
        }
        const batch =
          tokenType === TOKEN_TYPE_BEP2
            ? await httpRequest.getKline(params)
            : await httpRequest.getMiniTokenKline(params);
        if (!batch || !batch.length) break;
        const [openTime] = batch[batch.length - 1];
        lastTime = openTime;
        lastCount = batch.length;
        bars.push(...batch.map(convertKlineArrToBar));
      } catch (err) {
        errored = true;
        console.log(err);
        onError(err);
        break;
      }
    }
    if (!errored) {
      callback(bars, { noData: !bars.length });
    }
  };

  // ### subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscriberUID,
  //                    onResetCacheNeededCallback)
  // Charting Library calls this function when it wants to receive real-time updates for a symbol.
  // The Library assumes that you will call `onRealtimeCallback` every time you want to update
  // the most recent bar or to add a new one.
  // `symbolInfo`: [SymbolInfo](Symbology#symbolinfo-structure) object
  // `resolution`: string
  // `onRealtimeCallback`: function(bar)
  //     `bar`: object `{time, close, open, high, low, volume}`
  // `subscriberUID`: object
  // `onResetCacheNeededCallback` *(since version 1.7)*: function() to be executed
  //    when bar data has changed
  subscribeBars = async ({ name: symbol }, resolution, onMessage, uid, onResetNeeded) => {
    if (
      this._lastBarsSymbol &&
      this._lastBarsSymbol !== symbol &&
      this._resolution &&
      this._resolution !== resolution
    ) {
      onResetNeeded();
      return;
    }
    this._lastBarsSymbol = symbol;
    this._resolution = resolution;
    const interval = translateResolutionForBinance(resolution);
    const klinesWsUri = `${WSS_STREAM_URI}${symbol}@kline_${interval}`;
    this.sockets.set(
      uid,
      new WebSocket(klinesWsUri, {
        onopen: (ev) => {
          this.healthCheckHandler = setInterval(() => {
            if (ev.target.readyState === 1) {
              const ws = this.sockets.get(uid);
              ws && ws.json({ method: 'keepAlive' });
            }
          }, 1500000);
        },
        onmessage: ({ data: json }) => {
          if (!json || !json.length) {
            console.warn('TradingView feed: received kline without data!', json);
            return;
          }
          const { data } = JSON.parse(json);
          // data = JSON.parse(data);
          onMessage(convertKlineObjToBar(data));
        },
        onreconnect: () => {
          onResetNeeded();
        },
        onmaximum: () => {},
        onclose: () => {
          console.warn('TradingView feed: WebSocket data closed.');
          this.healthCheckHandler && clearInterval(this.healthCheckHandler);
        },
        onerror: (err) => {
          console.error('TradingView feed: WebSocket error:', err);
        },
      }),
    );
  };

  // ### unsubscribeBars(subscriberUID)
  // `subscriberUID`: object
  // Charting Library calls this function when it doesn't want to receive updates for
  // this subscriber any more. `subscriberUID` will be the same object that Library passed
  // to `subscribeBars` before.
  unsubscribeBars = (uid) => {
    const socket = this.sockets.get(uid);
    if (!socket) {
      console.warn('TradingView feed: unsubscribeBars called but socket not found.');
      return;
    }
    socket.close(1e3, 'Requested by TradingView');
  };

  // ### getServerTime(callback)
  // This function is called if the configuration flag `supports_time` is set to `true` when
  // the Charting Library needs to know the server time.
  // `callback`: function(unixTime)
  getServerTime = async (callback) => {
    const uri = `${this.baseUri}${SERVERTIME_API_PATH}`;
    try {
      const res = await fetch(uri);
      const timeObj = await res.json();
      // const timeObj = {};
      const ap_time =
        timeObj.ap_time && timeObj.ap_time.getTime
          ? timeObj.ap_time.getTime()
          : new Date().getTime();
      // const ap_time = new Date().getTime()
      const secs = Math.floor(parseInt(ap_time, 10) / 1000);
      callback(secs);
    } catch (err) {
      console.error('TradingView feed: getServerTime called but there was an error!');
    }
  };
}

export const generateTradingViewConfig = ({
  containerId,
  symbol,
  symbols,
  interval,
  locale,
  theme,
}) => {
  let timezone = EXCHANGE_TIMEZONE;
  // try to use local timezone, if api is available
  try {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (err) {
    // fallback to EXCHANGE_TIMEZONE
  }
  const disabled_features = [
    'header_widget',
    'header_symbol_search',
    'symbol_info',
    'header_compare',
    // 'use_localstorage_for_settings',
    // 'save_chart_properties_to_local_storage',
    'header_chart_type',
    'display_market_status',
    'symbol_search_hot_key',
    'compare_symbol',
    'border_around_the_chart',
    'remove_library_container_border',
    'symbol_info',
    'header_interval_dialog_button',
    'show_interval_dialog_on_key_press',
    'volume_force_overlay',
  ];

  if (isMobile()) {
    disabled_features.push('left_toolbar');
  }

  const libraryPath = '/static-trade/tradingview/charting_library/';

  return {
    // eslint-disable-line
    timezone, // user's browser timezone
    autosize: true,
    container_id: containerId,
    datafeed: new DataFeed(symbols),
    enabled_features: ['dont_show_boolean_study_arguments', 'hide_last_na_study_output'],
    disabled_features,
    interval,
    library_path: libraryPath,
    custom_css_url: theme.tradingViewCssPath,
    locale: getTradingViewLocale(SMARTLING_LOCALES[locale]) || 'en',
    overrides: theme.tradingViewOverrides || {}, // doesn't always work, see below
    studies_overrides: {
      'volume.volume.color.0': theme.tradingViewStyle.shortFill,
      'volume.volume.color.1': theme.tradingViewStyle.longFill,
    },
    style: '1',
    symbol,
    theme: theme.mode,
    toolbar_bg: 'rgba(255, 255, 255, 1)', // white
    time_frames: [],
  };
};

export default {
  translateResolutionForBinance,
  translateResolutionForTV,
  DataFeed,
};
