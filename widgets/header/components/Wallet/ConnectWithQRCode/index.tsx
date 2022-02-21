import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { Modal, Loading, QRCode } from '@binance-chain/honeycomb';
import { Consumer as WalletClientConsumer } from '@dex-kit/context/WalletConnectProvider';

import { useAppDispatch, useAppSelector } from '@dex-kit/hooks';
import { setWalletConnectURI } from '@dex-kit/store/walletConnect/action';

import { Title, QRCodeContainer, TextNote } from './styled';

export const ConnectWithQRCode = () => {
  const { wcUri } = useAppSelector((state) => state.walletConnect);
  const dispatch = useAppDispatch();

  const onModalClosed = useCallback(
    (walletConnectClient: any) => {
      walletConnectClient.connected && walletConnectClient.disconnect();
      dispatch(setWalletConnectURI(''));
    },
    [dispatch],
  );

  const renderTitle = () => (
    <>
      <Title>
        <FormattedMessage id="unlockWallet.title" />
      </Title>
      <Loading />
    </>
  );

  return (
    <WalletClientConsumer>
      {(walletConnectClient) => (
        <Modal
          open={!!wcUri}
          onClose={() => {
            onModalClosed(walletConnectClient);
          }}
        >
          <Modal.Header title={renderTitle()} />
          <Modal.Content>
            <TextNote>
              <FormattedMessage id="unlockWallet.description" />
            </TextNote>
            <QRCodeContainer>
              <QRCode value={wcUri} style={{ fontSize: 200 }} />
            </QRCodeContainer>
            <TextNote>
              <i className="i" />
              <FormattedMessage id="unlock.walletConnect.recommendedWallet" />:
              <span>
                <a href="https://trustwallet.com/">Trust Wallet</a>
              </span>
              ,
              <span>
                <a href="https://safepal.io/">SafePal</a>
              </span>
              ,
              <span>
                <a href="https://www.coolwallet.io/">CoolWallet S</a>
              </span>
              ,
              <span>
                <a href="https://www.mathwallet.org/en/">Math Wallet</a>
              </span>
              ,
              <span>
                <a href="https://meet.one/">Meet.one</a>
              </span>
              ,
              <span>
                <a href="https://chrome.google.com/webstore/detail/equal-wallet-the-metamask/blnieiiffboillknjnepogjhkgnoapac?hl=en">
                  Equal
                </a>
              </span>
              ,
              <span>
                <a href="https://atomicwallet.io/">Atomic Wallet</a>
              </span>
            </TextNote>
          </Modal.Content>
        </Modal>
      )}
    </WalletClientConsumer>
  );
};
