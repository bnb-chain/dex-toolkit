import { FormattedMessage } from 'react-intl';
import { ModalState, Button, Text, Space } from '@binance-chain/honeycomb';

import { Container, CTAContainer, ButtonContainer, GlobalStyle } from './styled';

export const Confirm = ({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  return (
    <ModalState open={open} onClose={onClose} icon={<ModalState.Icon.Warning />}>
      <Container>
        <Text size="normal">
          <FormattedMessage id="openOrders.areYourTrue" />{' '}
          <FormattedMessage id="openOrders.cancel" />
          {'?'}
        </Text>
        <CTAContainer>
          <ButtonContainer>
            <Button shape="fill" variant="secondary" onClick={onClose}>
              <FormattedMessage id="openOrders.keepOrders" />
            </Button>
          </ButtonContainer>
          <Space size="normal" />
          <ButtonContainer>
            <Button shape="fill" variant="primary" onClick={onConfirm}>
              <FormattedMessage id="openOrders.cancelOrders" />
            </Button>
          </ButtonContainer>
        </CTAContainer>
      </Container>
      <GlobalStyle />
    </ModalState>
  );
};
