import React, { Component, Fragment } from 'react';
import cloneDeep from 'lodash-es/cloneDeep';
import { connect } from 'react-redux';
import isEqual from 'lodash-es/isEqual';
import ExchangeDataProvider from './ExchangeDataProvider';
import { RootState } from '@dex-kit/store/store';
import { OrderBook } from '@dex-kit/store/orderbooks/types';
import { setOrderBook } from '@dex-kit/store/orderbooks/action';
import { setTradeHistory } from '@dex-kit/store/trade/action';
import { Ticker, Pair } from '@dex-kit/store/tradePairs/types';
import { setSymbolTickers } from '@dex-kit/store/tickers/action';

const MAX_TRADE_COUNT = 100;

type Props = {
  address: string;
  currentTrade: string;
  dispatch: Function;
  pairs: Array<Pair>;
  symbolTickers: Array<Ticker>;
  orderBooks: any;
  userInfo: any;
  tradeHistory: any;
};

class AggregateDataProvider extends Component<Props> {
  static defaultProps = {
    address: '',
    currentTrade: '',
    dispatch: () => {},
    pairs: [],
    symbolTickers: [],
    orderBooks: [],
    userInfo: {},
    tradeHistory: {},
  };

  _socketReceived = (res: any) => {
    if (res.stream === 'allMiniTickers') {
      this._handleWSAllMiniTickers(res.data);
    }

    if (res.stream === 'trades') {
      this._handleWSTrades(res.data);
    }

    if (res.stream === 'marketDepth') {
      this._handleWSMarketDepth(res.data);
    }
  };

  _sortTickerBySymbol = (symbolTickers: Array<Ticker>) => {
    if (!symbolTickers) return [];
    if (symbolTickers.length === 0) return symbolTickers;
    return symbolTickers.sort((a, b) => a.symbol.localeCompare(b.symbol));
  };

  _handleAllTickers = (tickers: Array<Ticker>) => {
    const parsedTickers = tickers.map((st: Ticker) => ({
      symbol: st.s,
      priceChangePercent: (parseFloat(st.c) - parseFloat(st.o)) / parseFloat(st.o),
      baseAssetVolume: st.v,
      quoteVolume: st.q,
      volume: st.q,
      price: parseFloat(st.c),
      highPrice: parseFloat(st.h),
      lowPrice: parseFloat(st.l),
    }));

    return this._sortTickerBySymbol(parsedTickers);
  };

  _handleWSAllMiniTickers = (newTickers: Array<Ticker>) => {
    if (!newTickers || newTickers.length === 0) return;
    const { dispatch, symbolTickers } = this.props;
    newTickers = this._handleAllTickers(newTickers);

    if (!isEqual(newTickers, symbolTickers)) {
      dispatch(setSymbolTickers({ from: 'ws', symbolTickers: newTickers }));
    }
  };

  _handleWSTrades = (dataArr: Array<any>) => {
    const { tradeHistory, currentTrade } = this.props;
    const { dispatch } = this.props;

    dataArr.forEach((data) => {
      const [baseAsset, quoteAsset] = data.s && data.s.split('_');
      if (data.s !== currentTrade) return;
      const newData = {
        price: data.p,
        quoteAsset,
        baseAsset,
        ...data,
      };
      tradeHistory.trade.unshift(newData);
    });

    if (tradeHistory.trade.length > 99) {
      tradeHistory.trade = tradeHistory.trade.slice(0, MAX_TRADE_COUNT);
    }

    const newTradeHistory = cloneDeep(tradeHistory);
    dispatch(setTradeHistory(newTradeHistory));
  };

  _handleWSMarketDepth = (item: OrderBook) => {
    const { dispatch, currentTrade, orderBooks } = this.props;
    if (item.symbol.toUpperCase() !== currentTrade.toUpperCase()) {
      console.log(`current trading pair: ${currentTrade}`);
      console.log(`incoming trading pair from ws: ${item.symbol}`);
      return;
    }

    if (item.bids.length === 0 && item.asks.length === 0) return;

    if (!orderBooks) {
      dispatch(setOrderBook(item));
      return;
    }

    if (!isEqual(orderBooks.asks, item.asks) || !isEqual(orderBooks.bids, item.bids)) {
      dispatch(setOrderBook(item));
    }
  };

  render() {
    const { currentTrade } = this.props;
    if (!currentTrade) {
      return null;
    }

    const combinedStreams = `stream?streams=$all@allMiniTickers/${currentTrade}@trades/${currentTrade}@marketDepth`;
    return (
      <Fragment>
        <ExchangeDataProvider
          socketReceived={this._socketReceived}
          symbol={currentTrade}
          stream={combinedStreams}
          topic="all"
          quantity={1}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = ({
  exchange: { currentTrade },
  tickers: { symbolTickers },
  trade: { tradeHistory },
  tradePairs: { pairs },
  orderBooks,
}: RootState) => ({
  pairs,
  currentTrade,
  tradeHistory,
  symbolTickers,
  orderBooks: orderBooks && orderBooks[currentTrade],
});

export default connect(mapStateToProps)(AggregateDataProvider);
