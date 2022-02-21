import { useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import { ModalState, Button, Text, Space } from '@binance-chain/honeycomb';

import { isUnlockWithWalletConnect } from '@dex-kit/utils/account';
import { Context } from '@dex-kit/context/WalletConnectProvider';

import { Container, CTAContainer, ButtonContainer, GlobalStyle } from './styled';

export const DisconnectWallet = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const wcClient = useContext(Context);

  const onDisconnect = (wcClient: any) => () => {
    if (isUnlockWithWalletConnect()) {
      wcClient && wcClient.disconnect();
    }

    sessionStorage.removeItem('user');
    window.localStorage.removeItem('walletconnect');
    window.location.reload();
  };

  return (
    <ModalState open={open} onClose={onClose} icon={<ModalState.Icon.Warning />}>
      <Container>
        <Text size="normal">
          <FormattedMessage id="header.youWantCloseWallet" />
        </Text>
        <CTAContainer>
          <ButtonContainer>
            <Button shape="fill" variant="secondary" onClick={onClose}>
              <FormattedMessage id="common.cancel" />
            </Button>
          </ButtonContainer>
          <Space size="normal" />
          <ButtonContainer>
            <Button shape="fill" variant="primary" onClick={onDisconnect(wcClient)}>
              <FormattedMessage id="common.confirm" />
            </Button>
          </ButtonContainer>
        </CTAContainer>
      </Container>
      <GlobalStyle />
    </ModalState>
  );
};
