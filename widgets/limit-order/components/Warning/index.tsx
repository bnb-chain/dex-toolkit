import { FormattedMessage } from 'react-intl';
import { Modal, Space } from '@binance-chain/honeycomb';

import { Container, StyledIcon } from './styled';

type Props = {
  open: boolean;
  onClose: () => void;
};

export const Warning = ({ open, onClose }: Props) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header />
      <Modal.Content>
        <Container>
          <StyledIcon />
          <Space size="increased" />
          <FormattedMessage id="exchange.pleaseUnlockWallet.desc" />
        </Container>
      </Modal.Content>
    </Modal>
  );
};
