/* global Chart, Data, VisualDepth, CustLine */

const EXCHANGE = 'Binance';

export const getIntervals = () => ({
  '1m': 60,
  '3m': 180,
  '5m': 300,
  '15m': 900,
  '30m': 1800,
  '1h': 3600,
  '2h': 7200,
  '4h': 14400,
  '6h': 21600,
  '12h': 43200,
  '1d': 86400,
  // '3d': 259200,
  '1w': 604800,
  '1M': 2592000,
});
export const Indis = {
  MACD: 'macd',
  TRIX: 'trix',
  KDJ: 'kdj',
  StochRSI: 'storsi',
  RSI: 'rsi',
  EMV: 'emv',
  DMI: 'dmi',
  WR: 'wpr',
  OBV: 'obv',
  BOLL: 'bnd',
  MTM: 'mtm',
  SAR: 'psar',
  EMA: 'ema',
  CCI: 'cci',
  VWAP: 'vwap',
  MA: 'ma',
  AVL: 'avl',
  VOL: 'vol',
};

function getKlineIndPageName(indicatorName) {
  return Object.keys(Indis).find((key) => Indis[key] === indicatorName);
}

export const getSettings = (defaultInterval, isPro) => {
  // from https://git.io/vAQUs
  const loadSettings = JSON.parse(localStorage.chart || '{}');
  const BASE_SETTINGS = {
    t: defaultInterval,
    icontrols: true,
    i: [
      {
        // This is where the price is drawn. Only one slot with
        // 'main'
        m: true,
        // The pixel y-value of the top of the slot, inside the
        // border
        p: 0,
        // The height of the slot
        h: 50,
        // These are the indicators drawn under the price
        u: [
          /*
           * { // Indicator type 't': 'ema', // Indicator object
           * 'i': null, // Settings vector 's': [5] }, { //
           * Indicator type 't': 'ema', // Indicator object 'i':
           * null, // Settings vector 's': [10] }, { // Indicator
           * type 't': 'avl', // Indicator object 'i': null, //
           * Settings vector 's': [10] }
           */
        ],
        g: true,
        // These are the indicators on top of price
        o: [],
      },
      // Our first lower indicator is the volume bars
    ],
  };

  let curzb = 'MACD';
  let curOver = 'MA';
  if (!localStorage.chart || !isPro) {
    BASE_SETTINGS.i.push({
      m: false,
      t: 'vol',
      // The indicator object
      i: null,
      // The pixel y-value of the top of the slot, inside the
      // border
      p: 5,
      // The height of the slot
      h: 10,
      // Input settings for the indicator
      r: [],
    });

    BASE_SETTINGS.i.push({
      m: false,
      t: 'macd',
      // The indicator object
      i: null,
      // The pixel y-value of the top of the slot, inside the
      // border
      p: 5,
      // The height of the slot
      h: 10,
      // Input settings for the indicator
      r: [],
    });

    BASE_SETTINGS.i[0].u.push({
      t: 'ma',
      i: null,
      s: [7],
    });
    BASE_SETTINGS.i[0].u.push({
      t: 'ma',
      i: null,
      s: [25],
    });
    BASE_SETTINGS.i[0].u.push({
      t: 'ma',
      i: null,
      s: [99],
    });
  } else {
    curzb = loadSettings.curzb; /* eslint-disable-line */
    curOver = '';
    loadSettings.u.forEach((u) => {
      BASE_SETTINGS.i[0].u.push({ i: null, s: u.s, t: u.t });
      curOver = getKlineIndPageName(u.t);
    });

    loadSettings.i.forEach((i) => {
      curzb = getKlineIndPageName(i.t);
      BASE_SETTINGS.i.push({
        i: null,
        t: i.t,
        h: i.h,
        r: i.s,
        p: 5,
        m: false,
      });
    });
  }
  return { BASE_SETTINGS, curzb, curOver };
};

export const setChartSymbol = ({ symbol, quoteAsset, tickSize, minQty }) => {
  window.BJBTC.instrument(EXCHANGE, symbol, quoteAsset);
  Data.baseFixed = Math.abs(Math.log10(Number(minQty)));
  Data.qouteFixed = Math.abs(Math.log10(Number(tickSize)));
  Data.setup();
};

export const initCandleChart = ({
  symbol,
  quoteAsset,
  themeName,
  tickSize,
  minQty,
  defaultInterval,
  defaultLineType,
  containerEl,
  pro,
}) => {
  const chart = new Chart();
  chart.setLastColorIndex(1);
  const settings = getSettings(defaultInterval, pro);
  chart.build(containerEl, null, settings.BASE_SETTINGS);

  window.BJBTC.instrument(EXCHANGE, symbol, quoteAsset);
  chart.onTheme(themeName);
  chart.setMode(defaultLineType);

  const line = new CustLine(containerEl).build(); // eslint-disable-line
  line.setChartData(chart.getInernal());
  Data.baseFixed = Math.abs(Math.log10(Number(minQty)));
  Data.qouteFixed = Math.abs(Math.log10(Number(tickSize)));
  chart.setResolution(defaultInterval); // 30m
  line.ifNull(() => {
    chart.setCrossHair(true);
  });
  return {
    chart,
    line,
    curInd: settings.curzb,
    curOver: settings.curOver,
  };
};

export const initDepthChart = ({ themeName, containerEl, symbol, quoteAsset }) => {
  window.BJBTC.instrument(EXCHANGE, symbol, quoteAsset);
  window.UserAccount = window.UserAccount_Class.Build();
  containerEl.style = 'display: block !important;';
  const chart = new VisualDepth().build(containerEl, containerEl.parentElement);
  chart.onTheme(themeName);
  containerEl.style = '';
  return chart;
};
export const saveChartUserSettings = (chart) => {
  const storeObj = { i: [], o: [], u: [] };
  const { u, o } = chart.internals().slots[0];
  u.forEach((us) => {
    storeObj.u.push({ s: us.s, t: us.t });
  });
  o.forEach((os) => {
    storeObj.o.push({ s: os.s, t: os.t });
  });
  chart.internals().slots.forEach((slot) => {
    storeObj.i.push({
      h: slot.h,
      px: slot.px,
      s: slot.i && slot.i.settings ? slot.i.settings() : [],
      t: slot.t,
    });
  });
  localStorage.chart = JSON.stringify(storeObj);
};

export default {
  getIntervals,
  getSettings,
};
