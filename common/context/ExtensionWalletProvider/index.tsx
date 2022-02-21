import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal } from '@binance-chain/honeycomb';
import { useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { NETWORK_ENV } from '@dex-kit/utils/httpRequest';
import { ReactComponent as Sub } from './sub.svg';

import { RootState } from '@dex-kit/store/store';

import { Container, ContentTitle, Text, ButtonWrap } from './styled';

const NETWORKS = ['bbc-testnet', 'bbc-mainnet'];

const ExtensionWalletProvider: React.FC = () => {
  const intl = useIntl();
  const [isNetworkSupported, setIsNetworkSupported] = useState(true);
  const {
    address,
    network: { id, name },
    flags: { isExtensionWallet },
  } = useSelector((state: RootState) => state.account);

  useEffect(() => {
    setTimeout(() => {
      if (!name || !address || (address && !isExtensionWallet)) return;

      if ((id && !id.includes(NETWORK_ENV)) || !NETWORKS.includes(id)) {
        setIsNetworkSupported(false);
      } else {
        setIsNetworkSupported(true);
      }
    }, 100);
  }, [id, name, address, isExtensionWallet]);

  const close = useCallback(() => {
    setIsNetworkSupported(true);
  }, []);

  const toNetwork = useMemo(() => {
    return NETWORK_ENV.includes('mainnet') ? 'Binance Chain Mainnet' : 'Binance Chain Testnet';
  }, []);

  const changeNetwork = useCallback(() => {
    if (toNetwork === 'Binance Chain Mainnet') {
      /* @ts-ignore */
      window.BinanceChain.switchNetwork('bbc-mainnet');
    } else if (toNetwork === 'Binance Chain Testnet') {
      /* @ts-ignore */
      window.BinanceChain.switchNetwork('bbc-testnet');
    }
  }, [toNetwork]);

  return (
    <Modal open={!isNetworkSupported} onClose={close}>
      <Modal.Header />
      <Modal.Content>
        <Container>
          <Sub />
          <ContentTitle>
            <FormattedMessage id="extension.wallet.provider.title" />
          </ContentTitle>
          <Text>
            {intl
              .formatMessage({ id: 'extension.wallet.provider.desc' })
              .replace('{from}', name)
              .replace('{to}', toNetwork)}
          </Text>
          <ButtonWrap variant="primary" size="huge" shape="fit" onClick={changeNetwork}>
            <FormattedMessage id="extension.wallet.change.network" />
          </ButtonWrap>
        </Container>
      </Modal.Content>
    </Modal>
  );
};

export default ExtensionWalletProvider;
