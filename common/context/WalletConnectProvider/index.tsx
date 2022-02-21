import React, { createContext, useState, useEffect, useRef, useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { Toast, createToast, Modal } from '@binance-chain/honeycomb';
import delayP from 'delay';

import WalletConnectClient from '@dex-kit/utils/integrations/walletConnectClient';
import { isUnlockWithWalletConnect } from '@dex-kit/utils/account';
import httpRequest from '@dex-kit/utils/httpRequest';
import { saveAddress } from '@dex-kit/utils/storage';
import { getTokenType } from '@dex-kit/utils/tokenTypes';

import { RootState } from '@dex-kit/store/store';
import { setWalletConnectURI, setIsConnectedWithWallet } from '@dex-kit/store/walletConnect/action';
import { getAccount, setAccount } from '@dex-kit/store/account/action';
import { getOpenOrdersQS, getOrderHistoryQS } from '@dex-kit/store/order/action';
import { getTradeHistoryByAddressQS } from '@dex-kit/store/trade/action';

import { Consumer as BNCClientConsumer } from '../BNCClientProvider';

import { ToastContainer, ToastTitle, ToastDescription } from './styled';

export const Context = createContext({});

const BRIDGE_URI = null; // use default

const WalletConnectDelegateConfigurator = ({
  bncClient,
  walletConnectClient,
  preSignCb,
  postSignCb,
  errCb,
  isClientInitialized,
}: {
  bncClient: any;
  walletConnectClient: any;
  preSignCb: Function;
  postSignCb: Function;
  errCb: Function;
  isClientInitialized: boolean;
}) => {
  // similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    if (!bncClient || !walletConnectClient) return;
    if (!isUnlockWithWalletConnect()) return;
    if (!isClientInitialized) return;
    const delegate = walletConnectClient.getSigningDelegate(preSignCb, postSignCb, errCb);
    console.log('Setting WalletConnect signing delegate on BncClient.');
    bncClient.setSigningDelegate(delegate);
  });
  return null;
};

const WalletConnectProvider: React.FC = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const client: any = useRef(new WalletConnectClient(BRIDGE_URI));
  const dispatch = useDispatch();

  const {
    globalData: { triggerElement, deviceInfo },
    account: {
      flags: { isWalletConnect },
    },
    walletConnect: { isConnectedWithWallet },
  } = useSelector((state: RootState) => state);

  const reconnect = useCallback(async () => {
    window.localStorage.removeItem('walletconnect');

    if (client.current.connected()) {
      client.current.disconnect();
      await delayP(1000); // to be safe because we cannot await on disconnect
    }

    const uri = await client.current.startSession(false);

    dispatch(setWalletConnectURI(uri));
  }, [dispatch]);

  const pageUnLoad = useCallback(
    (e) => {
      client.current.disconnect();
    },
    [client],
  );

  const pageLoad = useCallback(async () => {
    if (!isConnectedWithWallet) return;

    const walletConnect = localStorage.getItem('walletconnect');
    const parsed = walletConnect && JSON.parse(walletConnect);

    try {
      if (parsed && parsed.handshakeTopic) {
        const checkResult = await httpRequest.checkTopic(parsed.handshakeTopic);

        if (checkResult && checkResult.isAlive) {
          client.current.restoreSession();
        } else {
          reconnect();
        }
      } else {
        reconnect();
      }
    } catch (err) {
      reconnect();
      console.log(err);
    }
  }, [isConnectedWithWallet, reconnect]);

  const onRestore = useCallback(() => {
    dispatch(setIsConnectedWithWallet(true));
  }, [dispatch]);

  const onConnect = useCallback(
    ({ accounts }) => {
      const flags = {
        isWalletConnect: true,
        isHardWare: true,
      };
      const user = sessionStorage.getItem('user');
      const parsed = (user && JSON.parse(user)) || {};

      dispatch(
        setAccount({
          address: accounts[0],
          flags,
          privateKey: 'HARDWARE',
        }),
      );
      dispatch(setWalletConnectURI(''));
      dispatch(setIsConnectedWithWallet(true));

      if (accounts[0] !== parsed.address) {
        dispatch(getAccount(accounts[0]));
        saveAddress(accounts[0], {
          keystore: 'HARDWARE',
          flags,
        });
        const tokenType = getTokenType();
        const params = {
          address: accounts[0],
          offset: 0,
          total: 1,
          limit: 30,
        };
        dispatch(getOpenOrdersQS({ params, tokenType }));
        dispatch(getOrderHistoryQS({ params, withLoading: true, tokenType }));
        dispatch(getTradeHistoryByAddressQS({ params, withLoading: true, tokenType }));
      } else {
        if (triggerElement && typeof triggerElement.click === 'function') {
          triggerElement.click();
        }
      }
    },
    [deviceInfo, dispatch, triggerElement],
  );

  const onDisconnect = useCallback(async () => {
    dispatch(setWalletConnectURI(''));
    dispatch(setIsConnectedWithWallet(false));
    await delayP(1000);
    console.log('WalletConnect session disconnected');
    sessionStorage.removeItem('user');
    window.localStorage.removeItem('walletconnect');
    window.location.reload();
  }, [dispatch]);

  const onSessionUpdate = useCallback(
    (params) => {
      console.log('updated params...');
      console.log(params);
      dispatch(setWalletConnectURI(''));
      if (triggerElement && typeof triggerElement.click === 'function') {
        triggerElement.click();
      }
    },
    [dispatch, triggerElement],
  );

  const notify = useCallback(() => {
    const notifyMsg = isConnectedWithWallet
      ? 'Mobile Wallet connected'
      : 'Mobile Wallet disconnected';
    if (!isWalletConnect) return;

    createToast(
      <Toast icon={isConnectedWithWallet ? <Toast.Icon.Success /> : <Toast.Icon.Danger />}>
        <ToastContainer>
          <ToastTitle>Status</ToastTitle>
          <ToastDescription>{notifyMsg}</ToastDescription>
        </ToastContainer>
      </Toast>,
    );
  }, [isConnectedWithWallet, isWalletConnect]);

  useEffect(() => {
    client.current.on('connect', onConnect);
    client.current.on('restore', onRestore);
    client.current.on('disconnect', onDisconnect);
    client.current.on('session_update', onSessionUpdate);

    window.addEventListener('load', pageLoad);
    window.addEventListener('unload', pageUnLoad);

    return () => window.removeEventListener('load', pageLoad);
  }, [
    client,
    isConnectedWithWallet,
    onConnect,
    onDisconnect,
    onRestore,
    onSessionUpdate,
    pageLoad,
    pageUnLoad,
  ]);

  useEffect(() => {
    notify();
  }, [notify]);

  return (
    <Context.Provider value={client.current}>
      <BNCClientConsumer>
        {(bncClient) => (
          <>
            <WalletConnectDelegateConfigurator
              bncClient={bncClient}
              walletConnectClient={client.current}
              isClientInitialized={client.current.initialized()}
              preSignCb={() => setShowModal(true)}
              postSignCb={() => setShowModal(false)}
              errCb={() => setShowModal(false)}
            />
            {children}
          </>
        )}
      </BNCClientConsumer>

      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header title={<FormattedMessage id="walletConnect.readyToConfirm" />} />
        <Modal.Content>
          <FormattedMessage id="walletConnect.readyToConfirmBody" />
        </Modal.Content>
      </Modal>
    </Context.Provider>
  );
};

export const { Provider, Consumer } = Context;

export default WalletConnectProvider;
