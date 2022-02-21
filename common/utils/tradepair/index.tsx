export const SUFFIX_B_COINS = [
  'TUSDB',
  'THKDB',
  'TGBPB',
  'TCADB',
  'TAUDB',
  'IDRTB',
  'BTCB',
  'USDSB',
];

const reduceTradePairBSuffix = (tradePair: string) => {
  if (!tradePair) return '';
  let [baseAsset, quoteAsset] = tradePair.split('_');
  if (SUFFIX_B_COINS.find((c) => baseAsset?.toUpperCase()?.includes(c))) {
    baseAsset = baseAsset.replace(/B-.+/i, '');
  }

  if (SUFFIX_B_COINS.find((c) => quoteAsset?.toUpperCase()?.includes(c))) {
    quoteAsset = quoteAsset.replace(/B-.+/i, '');
  }

  return quoteAsset
    ? `${baseAsset.replace(/-.+/i, '')}_${quoteAsset.replace(/-.+/i, '')}`
    : baseAsset.replace(/-.+/i, '');
};

export default reduceTradePairBSuffix;
