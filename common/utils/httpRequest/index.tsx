import axios, { AxiosResponse, AxiosError, AxiosInstance } from 'axios';
import { isMiniTokenEnabled } from '../env';

export const NETWORK_ENV = process.env.REACT_APP_NETWORK_ENV || 'testnet';
export const isMainnet = process.env.REACT_APP_NETWORK_ENV === 'mainnet';
export const getDomain = () =>
  isMainnet ? 'https://www.binance.org' : 'https://testnet.binance.org';
export const getCDNDomain = () =>
  isMainnet ? 'https://dex-bin.bnbstatic.com' : 'https://testnet-bin.bnbstatic.com';
export const gitVersion = process.env.REACT_APP_GIT_SHA || '';
export const cdnUrl = process.env.REACT_APP_PUBLIC_URL || '';
/* @ts-ignore */
window.__network__ = process.env.REACT_APP_NETWORK_ENV;
/* @ts-ignore */
window.__commit__ = gitVersion;
/* @ts-ignore */
window.__cdn_url__ = cdnUrl;

const NET_WORK_MAPPING: { [key: string]: Array<string> } = {
  qa: ['dex-api.fdgahl.cn'],
  testnet: [
    'testnet-dex-asiapacific.binance.org',
    'testnet-dex-atlantic.binance.org',
    'testnet-dex-cn.yshyqxx.com',
  ],
  mainnet: [
    'dex-asiapacific.binance.org',
    'dex-european.binance.org',
    'dex-atlantic.binance.org',
    'dex-cn.yshyqxx.com',
  ],
};

export const FINGER_PRINT_URL_MAPPING: { [key: string]: string } = {
  qa: 'https://dexqa-ud.fdgahl.cn',
  testnet: 'https://testnet-ud.binance.org',
  mainnet: 'https://ud.binance.org',
};

const WALLETCONNECTURL = 'https://wallet-bridge.binance.org';

export const NETWORKS = NET_WORK_MAPPING[NETWORK_ENV];

export const savedNetwork = window.sessionStorage.getItem('network');

const LIMIT = 1000;

export const EXPLORER_URL =
  process.env.REACT_APP_EXPLORER || isMainnet
    ? 'https://explorer.binance.org'
    : 'https://testnet-explorer.binance.org';

class HttpRequest {
  static instance: AxiosInstance;

  constructor() {
    if (!HttpRequest.instance) {
      const baseUri = savedNetwork || NETWORKS[0];
      this.baseUri = `https://${baseUri}`;
      this.wssUri = `wss://${baseUri}/api/`;
      this.axiosClient = axios.create({
        baseURL: this.baseUri,
      });
    }

    return this;
  }

  baseUri: string = '';
  wssUri: string = '';
  axiosClient: any;

  public getHttpBaseUri() {
    return this.baseUri;
  }

  public getWSSBaseUri() {
    return this.wssUri;
  }

  public setBaseUri(baseUri: string) {
    this.baseUri = `https://${baseUri}`;
    this.wssUri = `wss://${baseUri}/api/`;
  }

  public getBalances(address: string) {
    return this.request('get', `/api/v1/balances/${address}`, null, this.getHttpBaseUri());
  }

  public getAccount(address: string) {
    return this.request('get', `/api/v1/account/${address}`, null, this.getHttpBaseUri());
  }

  public getNodeInfo() {
    return this.request('get', '/api/v1/node-info', null, this.getHttpBaseUri());
  }

  public getBep2Pairs() {
    return this.request('get', '/api/v1/markets', { limit: LIMIT }, this.getHttpBaseUri());
  }

  public getBep8Pairs() {
    if (!isMiniTokenEnabled) return Promise.resolve([]);
    return this.request('get', '/api/v1/mini/markets', { limit: LIMIT }, this.getHttpBaseUri());
  }

  public getFees() {
    return this.request('get', '/api/v1/fees', null, this.getHttpBaseUri());
  }

  public getTokens() {
    return this.request(
      'get',
      '/api/v1/tokens',
      { limit: LIMIT, offset: 0 },
      this.getHttpBaseUri(),
    );
  }

  public getMiniTokens() {
    if (!isMiniTokenEnabled) return Promise.resolve([]);
    return this.request('get', '/api/v1/mini/tokens', { limit: LIMIT }, this.getHttpBaseUri());
  }

  public getDepth(params: any) {
    return this.request('get', '/api/v1/depth', params, this.getHttpBaseUri());
  }

  public getOpenOrdersQS(params: any) {
    return this.request('get', '/api/v1/orders/open', params, this.getHttpBaseUri());
  }

  public getOpenOrdersQSForBep8(params: any) {
    if (!isMiniTokenEnabled) return Promise.resolve({ order: [], total: 0 });
    return this.request('get', '/api/v1/mini/orders/open', params, this.getHttpBaseUri());
  }

  public getOrderHistoryQS(params: any) {
    return this.request('get', '/api/v1/orders/closed', params, this.getHttpBaseUri());
  }

  public getOrderHistoryQSForBep8(params: any) {
    if (!isMiniTokenEnabled) return Promise.resolve({ order: [], total: 0 });
    return this.request('get', '/api/v1/mini/orders/closed', params, this.getHttpBaseUri());
  }

  public getOrderTradeHistoryQS(params: any) {
    return this.request('get', '/api/v1/trades', params, this.getHttpBaseUri());
  }

  public getOrderTradeHistoryQSForBep8(params: any) {
    if (!isMiniTokenEnabled) return Promise.resolve({ trade: [], total: 0 });
    return this.request('get', '/api/v1/mini/trades', params, this.getHttpBaseUri());
  }

  public getFiatCurrency() {
    return this.request('get', '/api/v1/fiat-currency', null, this.getHttpBaseUri());
  }

  public getCryptoCurrency() {
    return this.request('get', '/api/v1/crypto-currency', null, this.getHttpBaseUri());
  }

  public get24HrTickerForBep2() {
    return this.request('get', '/api/v1/ticker/24hr', null, this.getHttpBaseUri());
  }

  public get24HrTickerForBep8() {
    if (!isMiniTokenEnabled) return Promise.resolve([]);
    return this.request('get', '/api/v1/mini/ticker/24hr', null, this.getHttpBaseUri());
  }

  public getTradesByHeight(params: any) {
    return this.request('get', '/api/query/trades-by-height', params, this.getHttpBaseUri());
  }

  public getPeers() {
    return this.request('get', 'api/v1/peers', null, this.getHttpBaseUri());
  }

  public getTradesByBlock(params: any) {
    return this.request('get', 'api/v1/block-trades', params, this.getHttpBaseUri());
  }

  public ipValidate() {
    return this.request('get', 'api/ip-validate', null, this.getHttpBaseUri());
  }

  public getTransactions(params: any) {
    return this.request('get', '/api/v1/transactions', params, this.getHttpBaseUri());
  }

  public getBlockExchangeFees(params: any) {
    return this.request('get', '/api/v1/block-exchange-fee', params, this.getHttpBaseUri());
  }

  public getI18nData(locale: string) {
    return this.request(
      'get',
      `static/i18n/${locale}/projects/web-wallet/meta.json`,
      null,
      getCDNDomain(),
      1000,
    );
  }

  public checkTopic(topic: any) {
    return this.request('get', '/checkTopic', { topic }, WALLETCONNECTURL, 3000);
  }

  public getKline(params: any) {
    return this.request('get', `/api/v1/klines`, params, this.getHttpBaseUri());
  }

  public getMiniTokenKline(params: any) {
    if (!isMiniTokenEnabled) return Promise.resolve([]);
    return this.request('get', `/api/v1/mini/klines`, params, this.getHttpBaseUri());
  }

  public ping(baseUri?: string) {
    /* @ts-ignore */
    return this.request('get', '/api/v1/ping', null, baseUri);
  }

  public collectMetrics(params: any) {
    const options = {
      method: 'post',
      data: JSON.stringify(params),
      url: '/api/perf/metrics',
      baseURL: this.baseUri,
      headers: {
        'content-type': 'application/json',
      },
    };

    return this.axiosClient
      .request(options)
      .then((response: any) => response.data)
      .catch((err: any) => {
        console.log(err);
      });
  }

  public request(method: string, path: string, params: any, baseUri: string, timeout = 30000) {
    const options = {
      timeout,
      method: method.toLowerCase(),
    } as any;

    options.baseURL = baseUri || this.baseUri;

    if (options.method === 'get') {
      options.url = formatUrlQuery(path, params); // eslint-disable-line no-use-before-define
    }

    if (options.method === 'post') {
      options.data = JSON.stringify(params);
    }

    return this.axiosClient
      .request(options)
      .then((response: AxiosResponse) => {
        return response.data;
      })
      .catch((error: AxiosError) => {
        console.error(`[API Failed] ${error.message || ''}`, error, options);
        throw error;
      });
  }
}

function formatUrlQuery(url: string, data: any) {
  const arr = [];
  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  for (const k in data) {
    arr.push(`${k}=${data[k]}`);
  }
  return `${url}?${arr.join('&')}`;
}

export default new HttpRequest();
