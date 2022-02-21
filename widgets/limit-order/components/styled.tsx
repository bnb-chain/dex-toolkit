import styled, { createGlobalStyle } from 'styled-components';
import { em } from 'polished';

import { mediaQuery } from '@dex-kit/utils';

const { lg } = mediaQuery;

export const Container = styled.div`
  background-color: ${({ theme }) => theme.honeycomb.color.bg.normal};
  margin-top: ${({ theme }) => em(theme.honeycomb.size.micro / 2)};
  margin-left: ${({ theme }) => em(theme.honeycomb.size.micro / 2)};
  margin-bottom: ${({ theme }) => em(theme.honeycomb.size.micro / 2)};
  display: flex;
  flex: 0 0 548px; /* bad magic number */
  flex-direction: column;

  ${lg`
    flex: 1 0 548px; /* bad magic number */
  `}
`;

export const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: ${({ theme }) => `0 ${em(theme.honeycomb.size.small)}`};
`;

export const Positive = styled.span`
  color: ${({ theme }) => theme.honeycomb.color.success.normal};
`;

export const Negative = styled.span`
  color: ${({ theme }) => theme.honeycomb.color.danger.normal};
`;

export const PriceContainer = styled.div`
  align-items: center;
  display: flex;
  font-size: ${({ theme }) => em(theme.honeycomb.size.small)};
  padding: ${({ theme }) => `${em(theme.honeycomb.size.tiny)} ${em(theme.honeycomb.size.small)}`};
  justify-content: space-between;
`;

export const Title = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.honeycomb.color.border};
  display: flex;
  font-size: ${({ theme }) => em(theme.honeycomb.size.reduced)};
  font-weight: bold;
  height: 41px; /* bad */
  padding: ${({ theme }) => `${em(theme.honeycomb.size.tiny)} ${em(theme.honeycomb.size.small)}`};
  margin: 0;
  justify-content: space-between;
  align-items: center;
`;

export const MoonPayContainer = styled.div`
  display: flex;
  flex: 0 0 135px;

  > a {
    height: ${em(32)};
  }
`;

export const CTAContainer = styled.div`
  display: flex;
  flex: 1 0 25%;

  &.last-cta {
    flex-basis: 40%;
  }
`;

export const Forms = styled.div`
  display: flex;
`;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0 50%;
  padding: ${({ theme }) => em(theme.honeycomb.size.small)};
`;

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

export const GlobalStyles = createGlobalStyle`
  .Toastify__toast-container--top-right {
    top: 6em;
  }

  .Toastify__toast-container {
    max-width: 25.25em;
  }

  .small-viewport-limit-order-cta ul {
    li[data-testisselected=true] {
      &:first-child {
        background-color: ${({ theme }) => theme.honeycomb.color.buy.normal};
      }

      &:last-child {
        color: ${({ theme }) => theme.honeycomb.color.text.normal};
        background-color: ${({ theme }) => theme.honeycomb.color.sell.normal};
      }
    }
  }
}
`;

export const LabelContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const SetterContainer = styled.div`
  display: flex;
  flex: 1 0 auto;
  justify-content: flex-end;
`;

export const Setter = styled.button`
  color: ${({ theme }) => theme.honeycomb.color.text.normal};
  cursor: pointer;
  background: none;
  border: none;
  margin: 0;
  padding: 0;
  text-decoration: underline;

  &:hover {
    color: ${({ theme }) => theme.honeycomb.color.primary.normal};
  }
`;

export const Asset = styled.span`
  color: ${({ theme }) => theme.honeycomb.color.text.masked};
  font-size: ${({ theme }) => em(theme.honeycomb.size.small, theme.honeycomb.size.reduced)};
`;
