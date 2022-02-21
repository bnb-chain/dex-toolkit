import React, { useCallback, useEffect, useState, useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import { useTheme } from 'styled-components';
import { Modal, Loading } from '@binance-chain/honeycomb';
import { Context as BNCContext } from '@dex-kit/context/BNCClientProvider';

import { useAppSelector } from '@dex-kit/hooks';
import { getExtensionSigningDelegate } from '@dex-kit/utils/extensions';
import { LoadingModalContainer, LoadingModalTitle, LoadingModalContent } from './styled';

export const ModalHost = () => {
  const [showModal, setShowModal] = useState(false);
  const theme = useTheme();
  const bncClient = useContext(BNCContext);
  const {
    flags: { isExtensionWallet },
    address,
  } = useAppSelector((state) => state.account);

  const close = useCallback(() => {
    setShowModal(false);
  }, []);

  const preSign = useCallback(() => {
    setShowModal(true);
  }, []);

  const postSign = useCallback(() => {
    setShowModal(false);
  }, []);

  useEffect(() => {
    if (address && isExtensionWallet) {
      bncClient.setSigningDelegate(getExtensionSigningDelegate(preSign, postSign, close));
    }
  }, [address, bncClient, close, isExtensionWallet, postSign, preSign]);

  return (
    <Modal open={showModal} onClose={close}>
      <Modal.Header />
      <Modal.Content>
        <LoadingModalContainer>
          <Loading color={theme.honeycomb.color.text.primary} className="loading" />
          <LoadingModalTitle>
            <FormattedMessage id="extension.wallet.wait.for.confirmation" />
          </LoadingModalTitle>
          <LoadingModalContent>
            <FormattedMessage id="extensino.wallet.wait.for.desc" />
          </LoadingModalContent>
        </LoadingModalContainer>
      </Modal.Content>
    </Modal>
  );
};
