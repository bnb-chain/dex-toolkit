import styled from 'styled-components';
import { em } from 'polished';
import { Icon, Dropdown } from '@binance-chain/honeycomb';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.honeycomb.color.text.normal};
  line-height: 16px;
  cursor: pointer;
  white-space: nowrap;
  height: 100%;
  width: 100%;
  a {
    color: ${({ theme }) => theme.honeycomb.color.text.normal};
    height: 100%;
    width: 100%;
    display: flex;
    text-align: left;
    align-items: center;
    &:hover {
      color: ${({ theme }) => theme.honeycomb.color.text.primary};
    }
  }
  svg {
    transform: translateY(2px);
  }
`;

export const Profile = styled.div`
  margin-top: ${({ theme }) => em(theme.honeycomb.size.tiny)};
  margin-bottom: ${({ theme }) => em(theme.honeycomb.size.tiny)};
  background: ${({ theme }) => theme.honeycomb.color.secondary.normal};
  border-radius: ${({ theme }) => em(theme.honeycomb.radius.normal)};
  padding: ${({ theme }) => `${em(theme.honeycomb.size.micro)} ${em(theme.honeycomb.size.small)}`};
  height: ${({ theme }) => theme.honeycomb.size.huge}px;
  display: flex;
  flex-direction: column;
  min-width: ${em(130)};
  align-items: flex-start;
  transition: color 0.3s ease;
  color: ${({ theme }) => theme.honeycomb.color.text.normal};
  cursor: pointer;
  justify-content: center;
  font-size: ${({ theme }) => em(theme.honeycomb.size.reduced)};

  svg {
    transition: color 0.3s ease;
    fill: ${({ theme }) => theme.honeycomb.color.primary.normal};
  }
`;

export const ProfileInner = styled.div`
  align-items: center;
  display: flex;
  font-size: ${({ theme }) => em(theme.honeycomb.size.normal, theme.honeycomb.size.reduced)};
  font-weight: 500;
  line-height: ${({ theme }) => em(theme.honeycomb.size.increased)};
`;

export const ProfileInnerText = styled.div`
  display: flex;
  font-size: ${({ theme }) => em(theme.honeycomb.size.reduced, theme.honeycomb.size.reduced)};
  line-height: ${({ theme }) => em(theme.honeycomb.size.normal)};
  @media (max-width: ${em(767)}) {
    font-size: ${({ theme }) => em(10, theme.honeycomb.size.reduced)};
  }
`;

export const Address = styled.div`
  display: flex;
  padding-left: ${({ theme }) => em(theme.honeycomb.size.micro)};
  font-size: ${({ theme }) => em(theme.honeycomb.size.reduced, theme.honeycomb.size.reduced)};
`;

export const HighlightedAddress = styled(Address)`
  color: ${({ theme }) => theme.honeycomb.color.text.primary};
`;

export const BinanceWalletIcon = styled(Icon.BinanceChain)`
  font-size: ${({ theme }) => em(theme.honeycomb.size.reduced, theme.honeycomb.size.reduced)};
`;

export const WalletConnectColorIcon = styled(Icon.WalletConnectColor)`
  font-size: ${({ theme }) => em(20, theme.honeycomb.size.reduced)};
`;

export const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 4em;
  > a {
    border-radius: 0.5em;
  }
`;

export const AddressForCopy = styled.div`
  font-size: ${({ theme }) => em(theme.honeycomb.size.normal)};
  display: flex;
`;

export const AddressLabel = styled.div`
  color: ${({ theme }) => theme.honeycomb.color.text.masked};
  display: flex;
  font-size: ${({ theme }) => em(theme.honeycomb.size.small)};
  margin-bottom: ${({ theme }) => em(theme.honeycomb.size.micro)};
`;

export const AddressContainer = styled.div`
  display: flex;
  line-height: ${em(18)};
  justify-content: space-between;
  align-items: center;
`;

export const AddressOperations = styled.div`
  display: flex;
  font-size: ${({ theme }) => em(theme.honeycomb.size.small)};
`;

export const DropdownItem = styled(Dropdown.Item)`
  min-width: ${em(226)};
  padding: 0 ${({ theme }) => em(theme.honeycomb.size.normal, theme.honeycomb.size.reduced)};
`;

export const MainDropdownItem = styled(DropdownItem)`
  height: 4em;
`;

export const Connection = styled.div`
  display: flex;
  flex-direction: column;
  margin: -${({ theme }) => em(theme.honeycomb.size.small)} 0;
`;

export const BinanceChain = styled(Icon.BinanceChain)`
  font-size: ${({ theme }) => em(theme.honeycomb.size.increased)};
`;

export const Wallet = styled(Icon.WalletConnectColor)`
  font-size: ${({ theme }) => em(theme.honeycomb.size.large)};
`;

export const TypeName = styled.div`
  font-size: ${({ theme }) => em(theme.honeycomb.size.reduced)};
`;

export const ImgWrap = styled.div`
  &,
  img {
    width: ${({ theme }) => em(theme.honeycomb.size.increased)};
  }
`;

export const Option = styled.a`
  border-radius: ${({ theme }) => em(theme.honeycomb.size.tiny)};
  padding: ${({ theme }) => em(theme.honeycomb.size.normal)};
  margin: ${({ theme }) => em(theme.honeycomb.size.tiny)} 0;
  border: 1px solid ${({ theme }) => theme.honeycomb.color.bg.input.normal};
  text-align: center;
  color: ${({ theme }) => theme.honeycomb.color.text.normal};
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  background: ${({ theme }) => theme.honeycomb.color.bg.input.normal};
  position: 'relative';
  cursor: pointer;
  text-decoration: none;

  ${BinanceChain} {
    fill: ${({ theme }) => theme.honeycomb.color.primary.normal};
  }
  ${Wallet} {
    fill: ${({ theme }) => theme.honeycomb.color.primary.normal};
    font-size: ${({ theme }) => em(theme.honeycomb.size.increased)};
  }

  &:hover {
    border-color: ${({ theme }) => theme.honeycomb.color.primary.normal};
    text-decoration: none;
  }
`;

export const OptionContent = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  padding-right: ${({ theme }) => em(theme.honeycomb.size.tiny)};
`;

export const LeftContent = styled.p`
  color: ${({ theme }) => theme.honeycomb.color.text.masked};
  font-size: ${({ theme }) => em(theme.honeycomb.size.small)};
`;

export const Original = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: ${({ theme }) => em(theme.honeycomb.size.increased)};

  > a {
    color: ${({ theme }) => theme.honeycomb.color.text.primary};
    font-size: ${({ theme }) => em(theme.honeycomb.size.reduced)};
    text-decoration: none;

    &:hover {
      color: ${({ theme }) => theme.honeycomb.color.primary.normal};
      font-weight: 500;
      text-decoration: none;
    }
  }
`;

export const Notice = styled.div`
  color: ${({ theme }) => theme.honeycomb.color.text.masked};
  font-size: ${({ theme }) => em(theme.honeycomb.size.small)};
  margin-top: ${({ theme }) => em(theme.honeycomb.size.normal, theme.honeycomb.size.small)};
  text-align: center;
`;

export const WarnMessage = styled.div`
  color: ${({ theme }) => theme.honeycomb.color.danger.normal};
  font-size: ${({ theme }) => em(theme.honeycomb.size.small)};
  text-align: center;
  margin-top: ${({ theme }) => em(theme.honeycomb.size.increased, theme.honeycomb.size.small)};
`;

export const BadgeBox = styled.div``;

export const LeftSide = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  margin-right: ${({ theme }) => em(theme.honeycomb.size.normal)};
`;

export const ConnectionFailed = styled.div`
  margin-top: ${({ theme }) => em(theme.honeycomb.size.increased, theme.honeycomb.size.reduced)};
  color: ${({ theme }) => theme.honeycomb.color.danger.normal};
  text-align: center;
  font-size: ${({ theme }) => em(theme.honeycomb.size.reduced)};
`;
