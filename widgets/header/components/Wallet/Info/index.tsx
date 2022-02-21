import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Button, CopyToClipboard, Dropdown, Icon, Space } from '@binance-chain/honeycomb';

import { useAppSelector } from '@dex-kit/hooks';
import { EXPLORER_URL } from '@dex-kit/utils/httpRequest';
import formatAddress from '@dex-kit/utils/formatAddress';
import { isUnlockWithWalletConnect } from '@dex-kit/utils/account';

import {
  Profile,
  ProfileInner,
  ProfileInnerText,
  Address,
  HighlightedAddress,
  Container,
  BinanceWalletIcon,
  WalletConnectColorIcon,
  IconContainer,
  AddressForCopy,
  AddressLabel,
  AddressContainer,
  AddressOperations,
  DropdownItem,
  MainDropdownItem,
} from '../styled';

export const WalletInfo = ({
  unlock,
  disconnect,
}: {
  unlock: () => void;
  disconnect: () => void;
}) => {
  const {
    account: { address, network },
  } = useAppSelector((state) => state);
  const [showing, setShowing] = useState(false);

  const Target = (
    <Profile>
      <ProfileInner>
        {isUnlockWithWalletConnect() ? <WalletConnectColorIcon /> : <BinanceWalletIcon />}
        {showing ? (
          <HighlightedAddress>{formatAddress(address)}</HighlightedAddress>
        ) : (
          <Address>{formatAddress(address)}</Address>
        )}
      </ProfileInner>
      {!isUnlockWithWalletConnect() && (
        <ProfileInnerText>
          {network && network.name === '' ? 'Connecting...' : network.name}
        </ProfileInnerText>
      )}
    </Profile>
  );

  if (!address || address === '') return null;
  return (
    <Dropdown target={Target} onClick={() => setShowing(!showing)}>
      <MainDropdownItem>
        <Container>
          <AddressLabel>
            <FormattedMessage id="walletInfo.address" />
          </AddressLabel>
          <AddressContainer>
            <AddressForCopy>{formatAddress(address, 8)}</AddressForCopy>
            <AddressOperations>
              <Space size="normal" />
              <CopyToClipboard value={address} />
              <Space size="tiny" />
              <IconContainer>
                <Button
                  href={`${EXPLORER_URL}/address/${address}`}
                  target="_blank"
                  variant="secondary"
                  shape="square"
                  size="normal"
                  htmlTag="a"
                >
                  <Icon.ArrowTopRight />
                </Button>
              </IconContainer>
            </AddressOperations>
          </AddressContainer>
        </Container>
      </MainDropdownItem>
      <Dropdown.Divider />
      <DropdownItem onClick={unlock}>
        <Container>
          <FormattedMessage id="walletInfo.unlock" />
        </Container>
      </DropdownItem>
      <DropdownItem onClick={disconnect}>
        <Container>
          <FormattedMessage id="walletInfo.disconnect" />
        </Container>
      </DropdownItem>
    </Dropdown>
  );
};

WalletInfo.propTypes = {
  unlock: PropTypes.func.isRequired,
  disconnect: PropTypes.object.isRequired,
};
