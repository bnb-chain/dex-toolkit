/* eslint-disable */
import { Component } from 'react';
import WebSocket from './WebSocket';
import httpRequest from '@dex-kit/utils/httpRequest';

const MSG_BATCH_QTY = 100; // batch this many messages while tab is hidden to save cpu.
const WSS_URI = httpRequest.getWSSBaseUri();

type Props = {
  onClose: Function;
  onError: Function;
  onConnect: Function;
  onReconnect: Function;
  socketReceivedBatch: any;
  socketReceived: any;
  children: any;
  topic: string;
  symbol: string;
  quantity: any;
  stream: string;
};

class ExchangeDataProvider extends Component<Props> {
  static defaultProps = {
    onClose: () => {},
    onError: () => {},
    onConnect: () => {},
    onReconnect: () => {},
    socketReceivedBatch: null,
    socketReceived: null,
    children: null,
    topic: '',
    symbol: '',
    quantity: null,
    stream: '',
  };

  componentDidMount() {
    this._connect();

    const self = this;

    window.addEventListener(
      'offline',
      (this._offlineListener = () => {
        console.log('offline...');
        self._disconnect && self._disconnect();
      }),
    );

    window.addEventListener(
      'online',
      (this._onlineListener = () => {
        setTimeout(() => {
          console.log('online...');
          self._connect && self._connect();
        }, 1500);
      }),
    );
  }

  shouldComponentUpdate({ symbol }: any) {
    if (this.props.symbol !== symbol) {
      this._batch.length = 0;
      return true;
    }
    return false;
  }

  componentDidUpdate(prevProps: any) {
    const { symbol } = this.props;
    if (symbol !== prevProps.symbol) {
      this._connect();
    }
  }

  componentWillUnmount() {
    this._socket && this._socket.close(1e3, 'Component unmounting');
    this._onlineListener && document.removeEventListener('online', this._onlineListener);
    this._offlineListener && document.removeEventListener('offline', this._offlineListener);
    this.healthCheckHandler && clearInterval(this.healthCheckHandler);
    this._batch.length = 0;
  }

  // batch up messages when window is not focused to save cpu cycles.
  _batch: Array<any> = [];

  _socket: any;

  _onlineListener: any;

  _offlineListener: any;

  healthCheckHandler: any;

  _: any = null;

  _onMessage = ({ data }: any) => {
    const { socketReceivedBatch, quantity, socketReceived } = this.props;
    const maxQuantity = quantity ? quantity : MSG_BATCH_QTY;
    const parsedRes = data && JSON.parse(data);
    let parsedData = parsedRes.data;
    if (
      Array.isArray(parsedData) &&
      parsedRes.stream !== 'allMiniTickers' &&
      parsedRes.stream !== 'trades'
    ) {
      parsedData = parsedData[0];
    }

    if (this._batch.length <= maxQuantity) {
      parsedData && this._batch.unshift(parsedData);
    } else {
      this._batch.pop();
      parsedData && this._batch.unshift(parsedData);
    }

    socketReceivedBatch && socketReceivedBatch(this._batch);
    socketReceived && socketReceived({ stream: parsedRes.stream, data: parsedData });
  };

  _keepAlive = (ev: any) => {
    this.healthCheckHandler = setInterval(() => {
      if (ev.target.readyState === 1) {
        this._socket && this._socket.json({ method: 'keepAlive' });
      }
    }, 1500000);
  };

  _connect = () => {
    const { onClose, onError, onConnect, onReconnect, stream } = this.props;
    const self = this;
    this._socket && this._socket.close(1e3, 'close socket');
    const uri = WSS_URI + stream;
    const opts = {
      onopen: (ev: any) => {
        onConnect && onConnect(ev, self._socket);
        self._keepAlive(ev);
      },
      onmessage: this._onMessage.bind(self),
      onreconnect: (ev: any) => {
        onReconnect && onReconnect(ev);
      },
      onmaximum: () => {
        console.log('WebSocket max reconnects reached:');
      },
      onclose: (ev: any) => {
        const { code } = ev;
        onClose(ev);
      },
      onerror: (err: any) => {
        console.error('WebSocket error:', err);
        this._disconnect();
        onError(err);
      },
    };

    this._socket = new WebSocket(uri, opts);
  };

  _disconnect() {
    this._socket.close(1e3, 'user agent is offline');
  }

  render() {
    return this.props.children || null;
  }
}

export default ExchangeDataProvider;
