import { FormattedMessage, useIntl } from 'react-intl';

import { Header as HoneycombHeader } from '@binance-chain/honeycomb';
import { useWindowSize } from '@dex-kit/hooks';

import { useMenu } from './Menu';
import { CreateWallet } from './Wallet/Create';
import { UnlockWallet } from './Wallet/Unlock';
import { DisconnectWallet } from './Wallet/Disconnect';
import { ConnectWithQRCode } from './Wallet/ConnectWithQRCode';

import { GlobalStyles, Link } from './styled';

export const Main = () => {
  const { isSm } = useWindowSize();
  const { locale } = useIntl();
  const {
    leftItems,
    rightItems,
    nonCollapsibleItems,
    showCreateWalletModal,
    showUnlockWalletModal,
    showDisconnectModal,
    setShowCreateWalletModal,
    setShowUnlockWalletModal,
    setShowDisconnectModal,
  } = useMenu();

  return (
    <>
      <HoneycombHeader
        logo={
          <Link href={`/${locale}`} rel="noreferer">
            <HoneycombHeader.Logo text={!isSm && <FormattedMessage id="header.exchange.bep2" />} />
          </Link>
        }
        /* @ts-ignore */
        left={leftItems}
        right={rightItems}
        nonCollapsible={nonCollapsibleItems}
      />
      <CreateWallet open={showCreateWalletModal} onClose={() => setShowCreateWalletModal(false)} />
      <UnlockWallet open={showUnlockWalletModal} onClose={() => setShowUnlockWalletModal(false)} />
      <DisconnectWallet open={showDisconnectModal} onClose={() => setShowDisconnectModal(false)} />
      <ConnectWithQRCode />
      <GlobalStyles />
    </>
  );
};
