import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { Modal, Button, Icon } from '@binance-chain/honeycomb';
import { detect } from 'detect-browser';

import { Container, Text, DownloadLink, ContentTitle } from './styled';

const CheckInstallModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const browser = detect();

  const walletDownloadLink = useMemo(() => {
    switch (browser && browser.name) {
      case 'firefox':
        return 'https://addons.mozilla.org/en-GB/firefox/addon/binance-chain/';
      case 'chrome':
        return 'https://chrome.google.com/webstore/detail/binance-chain-wallet/fhbohimaelbohpjbbldcngcnapndodjp?utm_source=chrome-ntp-icon';
      default:
        return 'https://chrome.google.com/webstore/detail/binance-chain-wallet/fhbohimaelbohpjbbldcngcnapndodjp?utm_source=chrome-ntp-icon';
    }
  }, [browser]);

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header />
      <Modal.Content>
        <Container>
          <Icon.WarningCircleSolid />
          <ContentTitle>
            <FormattedMessage id="checkInstallModal.title" />
          </ContentTitle>
          <Text>
            <FormattedMessage id="checkInstallModal.text1" />
            <DownloadLink href={walletDownloadLink} target="blank">
              <FormattedMessage id="checkInstallModal.link" />
            </DownloadLink>
            <FormattedMessage id="checkInstallModal.text2" />
          </Text>
          <Button shape="fit" variant="primary" htmlTag="a" href={walletDownloadLink}>
            <FormattedMessage id="checkInstallModal.button.install" />
          </Button>
        </Container>
      </Modal.Content>
    </Modal>
  );
};

export default CheckInstallModal;
