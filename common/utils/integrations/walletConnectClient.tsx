import EventEmitter from 'events';
import { crypto } from '@binance-chain/javascript-sdk';
import WalletConnect from '@walletconnect/browser';

const DEFAULT_BRIDGE_URI = 'https://wallet-bridge.binance.org';

const WC_SIG_LEN = 64;
const WC_PK_LEN = 65;

/**
 * The WalletConnect signing delegate.
 * @param  {preSignCb}  function
 * @param  {postSignCb} function
 * @param  {errCb} function
 * @return {function}
 */
const WalletConnectSigningDelegate = (walletConnectClient, preSignCb, postSignCb, errCb) => async (
  tx,
  signMsg,
) => {
  const signBytes = tx.getSignBytes(signMsg);
  const signObject = JSON.parse(signBytes.toString());
  preSignCb && preSignCb(signBytes, signObject);
  let result;
  try {
    const resp = await walletConnectClient.sendTransaction(signObject);
    result = resp.result || resp;
  } catch (err) {
    errCb && errCb(err);
    console.error('WalletConnect error!', err);
    throw err;
  }
  if (!result) {
    errCb && errCb(new Error('The WalletConnect provider responded without a pubkey or signature'));
  }
  try {
    const { signature: sigHex, publicKey: pubKeyHex } = JSON.parse(result);
    const sigBuf = Buffer.from(sigHex, 'hex');
    // TODO: temporary length checks until this is done in the core js-sdk
    if (sigBuf.byteLength !== WC_SIG_LEN)
      throw new Error('WalletConnectSigningDelegate: invalid signature length');
    if (Buffer.from(pubKeyHex, 'hex').byteLength !== WC_PK_LEN)
      throw new Error('WalletConnectSigningDelegate: invalid pubkey length');
    const pubKey = crypto.getPublicKey(pubKeyHex);
    const signedTx = tx.addSignature(pubKey, sigBuf);
    // bnb_tx_confirmation is sent back async
    setTimeout(() => {
      walletConnectClient.sendConfirmation(true);
    }, 0);
    postSignCb && postSignCb(pubKeyHex, sigHex);
    return signedTx;
  } catch (err) {
    console.error('WalletConnectSigningDelegate: error during sig parse/add/confirm', err);
    // bnb_tx_confirmation is sent back async
    setTimeout(() => {
      walletConnectClient.sendConfirmation(false, err.message);
    }, 0);
    errCb && errCb(err);
    return tx;
  }
};

/**
 * The WalletConnect client class.
 */
class WalletConnectClient extends EventEmitter {
  static METHOD_SIGN = 'bnb_sign';

  static METHOD_CONFIRM = 'bnb_tx_confirmation';

  constructor(props) {
    super(props);

    this._connector = null;
    this._initialized = false;

    // this binds
    this._onConnect = this._onConnect.bind(this);
    this._onSessionUpdate = this._onSessionUpdate.bind(this);
    this._onDisconnect = this._onDisconnect.bind(this);
  }

  async startSession(showModal = false, bridgeUri = DEFAULT_BRIDGE_URI) {
    if (!this._initialized) {
      const connector = new WalletConnect({
        bridge: bridgeUri,
      });
      // trust wallet get address from the url, so hard code to ***binance**
      connector.clientMeta.url = 'https://www.binance.org';
      this._connector = connector;
      this._initialized = true;
    }

    if (this._connector.connected) {
      this._connector.killSession();
    }

    console.log('WalletConnect: creating session.');
    await this._connector.createSession();
    console.log('WalletConnect: session created.');
    const { uri } = this._connector;

    // attach connector event listeners
    this._connector.on('connect', this._onConnect);
    this._connector.on('disconnect', this._onDisconnect);
    this._connector.on('session_update', this._onSessionUpdate);

    if (showModal) {
      throw new Error('The WalletConnect QR code modal is not supported.');
    }

    return uri; // returns URI for custom QR
  }

  async restoreSession() {
    if (!this._initialized) {
      const connector = new WalletConnect({
        bridge: DEFAULT_BRIDGE_URI,
      });

      this._connector = connector;
      this._initialized = true;

      // attach connector event listeners
      this._connector.on('disconnect', this._onDisconnect);
      this._connector.on('session_update', this._onSessionUpdate);

      this.emit('restore');
    }
  }

  async sendTransaction(signDocObj) {
    if (!signDocObj || typeof signDocObj !== 'object') {
      throw new Error('sendTransaction expected a `signDocObj` of type `object`');
    }
    const customRequest = {
      id: 1,
      jsonrpc: '2.0',
      method: WalletConnectClient.METHOD_SIGN,
      params: [signDocObj],
    };
    return this._connector.sendCustomRequest(customRequest);
  }

  async sendConfirmation(ok = true, errorMsg = null) {
    if (typeof ok !== 'boolean') {
      throw new Error('sendConfirmation expected an `ok` of type `boolean`');
    }
    if (errorMsg && typeof errorMsg !== 'string') {
      throw new Error('sendConfirmation expected an optional `errorMsg` of type `string`');
    }
    const customRequest = {
      id: 1,
      jsonrpc: '2.0',
      method: WalletConnectClient.METHOD_CONFIRM,
      params: [{ ok, errorMsg }],
    };
    return this._connector.sendCustomRequest(customRequest);
  }

  disconnect() {
    if (this._connector) {
      // this._connector._socket && this._connector._socket.close()
      if (Array.isArray(this._connector._eventEmitters)) {
        this._connector._eventEmitters.length = 0;
      }
      this._connector.killSession();
      this._connector = null;
      this._initialized = false;
    }
  }

  initialized() {
    return !!this._initialized;
  }

  ready() {
    return !!this._initialized && this._connector.connected;
  }

  connected() {
    return this.ready();
  }

  getSigningDelegate(preSignCb, postSignCb, errCb) {
    return WalletConnectSigningDelegate(this, preSignCb, postSignCb, errCb);
  }

  _onConnect(err, { params }) {
    console.log('WalletConnect: _onConnect', this._initialized);
    if (!this._initialized) return;

    if (err) throw err;
    if (!params || !params[0]) throw new Error('_onConnect: no payload!');

    // get provided accounts and chainId
    const { accounts, chainId } = this._connector;
    const address = accounts[0];
    this.emit('connect', { chainId, accounts, address });
  }

  _onSessionUpdate(err, { params }) {
    console.log('WalletConnect: _onSessionUpdate', this._initialized);
    if (!this._initialized) return;
    if (err) throw err;
    if (!params || !params[0]) throw new Error('_onSessionUpdate: no payload!');

    this.emit('session_update', params[0]);
  }

  _onDisconnect(err, { params }) {
    console.log('WalletConnect: _onDisconnect', this._initialized);
    if (!this._initialized) {
      console.error(
        'WalletConnect disconnect when not ready. This should never happen!',
        err,
        params,
      );
      return;
    }
    if (err) throw err;
    if (!params || !params[0]) throw new Error('_onDisconnect: no payload!');

    this._initialized = false;
    delete this._connector;

    this.emit('disconnect', params[0]);
  }
}

export default WalletConnectClient;
