import styled from 'styled-components';
import { em } from 'polished';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Text = styled.p`
  font-size: ${({ theme }) => em(theme.honeycomb.size.reduced)};
  line-height: ${({ theme }) => em(theme.honeycomb.size.increased)};
  color: ${({ theme }) => theme.honeycomb.color.text.masked};
  margin-bottom: ${({ theme }) => em(theme.honeycomb.size.increased)};
  text-align: center;
`;

export const DownloadLink = styled.a`
  color: ${({ theme }) => theme.honeycomb.color.text.primary};
  padding: 0 5px;
`;

export const ContentTitle = styled.h1`
  font-size: ${em(16)};
  line-height: ${em(19)};
  margin-top: ${({ theme }) => em(theme.honeycomb.size.normal)};
  margin-bottom: ${({ theme }) => em(theme.honeycomb.size.small)};
`;
