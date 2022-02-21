import { useState, useContext } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Modal } from '@binance-chain/honeycomb';
import delayP from 'delay';

import isBrowserExtensionInstalled from '@dex-kit/utils/isBrowserExtensionInstalled';
import { requestSelectedAddress, switchNetwork } from '@dex-kit/utils/extensions';
import { saveAddress } from '@dex-kit/utils/storage';
import { getTokenType } from '@dex-kit/utils/tokenTypes';
import { getDomain } from '@dex-kit/utils/httpRequest';
import { useAppDispatch, useAppSelector } from '@dex-kit/hooks';
import { getAccount, setAccount } from '@dex-kit/store/account';
import { getOpenOrdersQS, getOrderHistoryQS } from '@dex-kit/store/order';
import { getTradeHistoryByAddressQS } from '@dex-kit/store/trade';
import { setWalletConnectURI } from '@dex-kit/store/walletConnect';
import { Context } from '@dex-kit/context/WalletConnectProvider';

import CheckInstallModal from '../Check';
import {
  Connection,
  Option,
  OptionContent,
  LeftContent,
  TypeName,
  ImgWrap,
  BinanceChain,
  LeftSide,
  Wallet,
  Original,
} from '../styled';

export const UnlockWallet = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [showBrowserExtensionModal, setShowBrowserExtensionModal] = useState(false);
  const dispatch = useAppDispatch();
  const {
    globalData: { deviceInfo },
  } = useAppSelector((state) => state);
  const wcClient = useContext(Context);
  const { locale } = useIntl();

  const onUnlockWithExtension = async () => {
    if (!isBrowserExtensionInstalled()) {
      setShowBrowserExtensionModal(true);
    } else {
      const address = await requestSelectedAddress();
      if (address.startsWith('0x')) {
        await switchNetwork();
        return;
      }

      if (address && address !== '') {
        const flags = { isExtensionWallet: true };
        saveAddress(address, { keystore: 'HARDWARE', flags });
        dispatch(getAccount(address));
        dispatch(
          setAccount({
            address,
            flags,
            privateKey: 'HARDWARE',
          }),
        );
        const tokenType = getTokenType();
        const params = {
          address,
          offset: 0,
          total: 1,
          limit: 30,
        };
        dispatch(getOpenOrdersQS({ params, tokenType }));
        dispatch(getOrderHistoryQS({ params, withLoading: true, tokenType }));
        dispatch(getTradeHistoryByAddressQS({ params, withLoading: true, tokenType }));
        onClose();
      }
    }
  };

  const onUnlockWithWalletConnect = (wcClient: any) => async () => {
    window.localStorage.removeItem('walletconnect');

    if (wcClient && wcClient.connected()) {
      wcClient.disconnect();
      await delayP(1000); // to be safe because we cannot await on disconnect
    }

    const uri = await wcClient.startSession(false);

    dispatch(setWalletConnectURI(uri));
    wcClient.on('connect', onConnect);
  };

  const onConnect = () => {
    setShowBrowserExtensionModal(false);
    onClose();
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Modal.Header title={<FormattedMessage id="unlockWallet.modal.title" />} />
        <Modal.Content>
          <Connection>
            <Option onClick={onUnlockWithExtension}>
              <OptionContent>
                <LeftSide>
                  <TypeName>
                    <FormattedMessage id="unlockWallet.option.extension.title" />
                  </TypeName>
                </LeftSide>
                <LeftContent>
                  <FormattedMessage id="unlockWallet.option.extension.content" />
                </LeftContent>
              </OptionContent>
              <ImgWrap>
                <BinanceChain />
              </ImgWrap>
            </Option>

            <Option onClick={onUnlockWithWalletConnect(wcClient)}>
              <LeftSide>
                <TypeName>
                  <FormattedMessage id="unlockWallet.option.wallet.connect" />
                </TypeName>
              </LeftSide>
              <ImgWrap>
                <Wallet />
              </ImgWrap>
            </Option>
          </Connection>

          <Original>
            <a href={`${getDomain()}/${locale}/unlock`}>
              <FormattedMessage id="unlockWallet.option.extension.link" />
            </a>
          </Original>
        </Modal.Content>
      </Modal>
      <CheckInstallModal
        open={showBrowserExtensionModal}
        onClose={() => setShowBrowserExtensionModal(false)}
      />
    </>
  );
};
