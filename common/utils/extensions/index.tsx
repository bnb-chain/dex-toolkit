import { crypto } from '@binance-chain/javascript-sdk';
import { NETWORK_ENV } from '../httpRequest';

export const requestSelectedAddress = async () => {
  if (typeof window === 'undefined') return {};

  const addresses = await window.BinanceChain.request({ method: 'eth_requestAccounts' });
  return addresses[0];
};

export const switchNetwork = async () => {
  const networkId = NETWORK_ENV === 'mainnet' ? 'bbc-mainnet' : 'bbc-testnet';
  await window.BinanceChain.switchNetwork(networkId);
};

export const getExtensionSigningDelegate = (preSignCb, postSignCb, errCb) => async (
  tx,
  signMsg,
  // eslint-disable-next-line consistent-return
) => {
  try {
    preSignCb && preSignCb(tx);
    const { pubKey: pubKeyHex, signature: sigHex } = await window.BinanceChain.bbcSignTx({
      tx,
      signMsg,
    });

    postSignCb && postSignCb();
    if (pubKeyHex && sigHex) {
      const pubKey = crypto.getPublicKey(pubKeyHex);
      return tx.addSignature(pubKey, Buffer.from(sigHex, 'hex'));
    }
  } catch (err) {
    errCb && errCb(err);
    throw new Error(err.error);
  }
};
