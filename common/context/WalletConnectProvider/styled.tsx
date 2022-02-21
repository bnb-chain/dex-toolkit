import styled from 'styled-components';
import { em } from 'polished';

export const ToastContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ToastTitle = styled.h3`
  display: flex;
  font-size: ${({ theme }) => em(theme.honeycomb.size.normal)};
  font-weight: bold;
  margin-top: 0;
  margin-bottom: ${({ theme }) => em(theme.honeycomb.size.micro)};
`;

export const ToastDescription = styled.p`
  display: flex;
  font-size: ${({ theme }) => em(theme.honeycomb.size.reduced, theme.honeycomb.size.normal)};
  margin-top: ${({ theme }) => em(theme.honeycomb.size.micro)};
  margin-right: ${({ theme }) => em(theme.honeycomb.size.normal)};
`;
