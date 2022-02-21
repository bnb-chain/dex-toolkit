import styled from 'styled-components';
import { em } from 'polished';
import { Button } from '@binance-chain/honeycomb';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Text = styled.p`
  font-size: ${em(14)};
  line-height: ${em(20)};
  color: ${({ theme }) => theme.honeycomb.color.text.normal};
`;

export const DownloadLink = styled.a`
  color: ${({ theme }) => theme.honeycomb.color.text.primary};
  padding: 0 5px;
`;

export const ContentTitle = styled.h1`
  color: ${({ theme }) => theme.honeycomb.color.text.normal} !important;
  font-size: ${em(16)};
  font-weight: 600;
  line-height: ${em(19)};
  margin-top: ${({ theme }) => em(theme.honeycomb.size.normal)};
  margin-bottom: ${({ theme }) => em(theme.honeycomb.size.increased)};
`;

export const ButtonWrap = styled(Button)`
  margin-top: ${({ theme }) => em(theme.honeycomb.size.increased, theme.honeycomb.size.reduced)};
`;
