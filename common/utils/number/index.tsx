/* eslint-disable */
import memoize from 'lodash-es/memoize';

const DECIMAL_PLACES_MATCHER = /(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/;

export const DASH = '–';
const POSITIVE_SYMBOL = '+';
const NEGATIVE_SYMBOL = '-';

// memoize for performance, avoids creating a RegExp each call
const getFormatNumberRegexp = memoize(
  (n, x) =>
    // eslint-disable-next-line prefer-template
    new RegExp('\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')', 'g'),
  (...args) => args.join(','),
);

export const equal = (x: number, y: number) => Math.abs(x - y) < Number.EPSILON;

export const formatNumber = (num: number, n: number, x = 3) => {
  if (typeof num !== 'number' && !num) return '-';
  num = typeof num === 'number' ? num : +num;
  const re = getFormatNumberRegexp(n, x);
  return num.toFixed(Math.max(0, ~~n)).replace(re, '$&,');
};

export const addPosNeg = (num: number, showPos = true) =>
  !equal(+num, 0) && +num > 0 ? `${showPos ? '+' : ''}${num}` : `${num}`;

export const getRoundFunc = (type = 'bids') =>
  (() => {
    switch (type) {
      case 'bids':
        return 'floor';
      case 'asks':
        return 'ceil';
      default:
        if (Math[type]) return Math[type];
        throw new Error('getRoundFunc called with unknown type');
    }
  })();

export const decRound = (
  input: number | string,
  precision: number,
  func: string | Function = 'round',
  format: boolean = false,
) => {
  const factor = 10 ** precision;
  const adj = 3;
  let num = (+input + 1 / 10 ** (precision + adj)) * factor;
  if (typeof func === 'string') {
    const dps = adj - 1;
    num = parseFloat(num * 10 ** dps, 10) / 10 ** dps;
    func = getRoundFunc(func);
  }
  if (typeof func !== 'function') throw new Error('decRound unknown rounding func');
  if (format) {
    return formatNumber(func(num) / factor, precision);
  }
  return (func(num) / factor).toFixed(precision);
};

export const floor = (num: number, digit: number) => decRound(num, digit, 'floor');

export const ceil = (num: number, digit: number) => decRound(num, digit, 'ceil');

export const decimalPlaces = (num: number | string) => {
  const match = `${num}`.match(DECIMAL_PLACES_MATCHER);
  if (!match) return 0;

  let matchValue = match[1];
  if (matchValue && matchValue.endsWith(0)) {
    const index = matchValue.indexOf(1);
    matchValue = matchValue.substring(0, index + 1);
  }
  return Math.max(
    0,
    // Number of digits right of decimal point.
    (matchValue ? matchValue.length : 0) -
      // Adjust for scientific notation.
      (match[2] ? +match[2] : 0),
  );
};

export const roundValue = (value: string | number, precision = '0.00000001') => {
  if (value === '') return '';
  if (Number.isInteger(value)) return value;

  const ts = decimalPlaces(Number(precision));

  //parseFloat is used to avoid 0.00000
  value = parseFloat(floor(value, ts));

  value = value < 0.000009 ? toNonExponential(value) : value;
  return value;
};

export const multiply = (...args: any) => {
  const nums = args.map((n) => Number(n));
  let factorsSum = 1;
  const factors = nums.map((n) => {
    const decimals = decimalPlaces(n);
    factorsSum *= 10 ** decimals;
    return 10 ** decimals * n;
  });
  const product = factors.reduce((n, pre) => pre * n, 1);
  if (product > Number.MAX_SAFE_INTEGER) {
    return nums.reduce((n, pre) => n * pre, 1);
  }
  return product / factorsSum;
};

export const pad = (num: number, size = 2) => {
  let str = String(num);
  while (str.length < size) {
    str = `0${str}`;
  }
  return str;
};

export const toNonExponential = (num: number) => {
  num = parseFloat(num);
  const m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
  return num.toFixed(Math.max(0, (m[1] || '').length - m[2]));
};

const getPercentageSymbol = (numerator: number, denominator: number) => {
  if (numerator > 0) {
    if (denominator > 0) {
      return POSITIVE_SYMBOL;
    }
    return NEGATIVE_SYMBOL;
  } else if (numerator < 0) {
    if (denominator > 0) {
      return NEGATIVE_SYMBOL;
    }
    return POSITIVE_SYMBOL;
  }
  return '';
};

export const percentage = (
  numerator: number,
  denominator: number,
  config = { digit: 2, withSymbol: false },
) => {
  const { digit = 2, withSymbol = false } = config;
  const symbol = withSymbol ? getPercentageSymbol(numerator, denominator) : '';
  return denominator === 0
    ? DASH
    : `${symbol}${decRound(Math.abs(numerator / denominator) * 100, digit)}%`;
};

export const calPrice = (price: number, isCoin?: boolean) => {
  if (!price.toFixed) return price;
  if (!price) return '-';
  if (price < 1) {
    return isCoin ? price.toFixed(8) : price.toFixed(6);
  }
  return price.toFixed(2);
};

export const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * Math.floor(max));
};

export default {
  getRoundFunc,
  decRound,
  formatNumber,
  decimalPlaces,
  pad,
  floor,
  ceil,
};
