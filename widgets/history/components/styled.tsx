import styled, { createGlobalStyle } from 'styled-components';
import { Table, Dropdown } from '@binance-chain/honeycomb';
import { em } from 'polished';

import { mediaQuery } from '@dex-kit/utils';

const { md, lg } = mediaQuery;

export const Container = styled.div`
  background-color: ${({ theme }) => theme.honeycomb.color.bg.normal};
  margin-top: ${({ theme }) => em(theme.honeycomb.size.micro / 2)};
  margin-right: ${({ theme }) => em(theme.honeycomb.size.micro / 2)};
  margin-bottom: ${({ theme }) => em(theme.honeycomb.size.micro / 2)};
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  overflow: auto hidden;
  position: relative;
`;

export const TableContainer = styled.div`
  display: flex;
  flex: 1 0 auto;
  flex-direction: column;
  height: ${em(220)};
  overflow: hidden;

  ${lg`
    height: ${em(320)};
  `}

  ${md`
    height: 100%;
  `}
`;

export const StyledTable = styled(Table)`
  overflow: hidden;

  ${Table.TheadTr} {
    font-size: ${({ theme }) => em(theme.honeycomb.size.small, theme.honeycomb.size.small)};
    height: ${em(24)}; /* Unfortunately, fixed value seems required */
    line-height: ${em(24)}; /* Unfortunately, fixed value seems required */
  }

  ${Table.TbodyTr} {
    color: ${({ theme }) => theme.honeycomb.color.text.normal};
    font-size: ${({ theme }) => em(theme.honeycomb.size.small, theme.honeycomb.size.normal)};
    height: ${em(32)}; /* Unfortunately, fixed value seems required */
    line-height: ${em(32)}; /* Unfortunately, fixed value seems required */
  }

  ${Table.Th} {
    padding-left: 1.5em;
    padding-top: ${({ theme }) => em(theme.honeycomb.size.micro)};
    padding-bottom: ${({ theme }) => em(theme.honeycomb.size.micro)};
  }

  ${Table.Td} {
    padding-top: ${({ theme }) => em(theme.honeycomb.size.micro / 2)};
    padding-bottom: ${({ theme }) => em(theme.honeycomb.size.micro / 2)};
  }
`;

export const DefaultTarget = styled(Dropdown.DefaultTarget)`
  font-size: ${({ theme }) => em(theme.honeycomb.size.small)};
  padding: 0 ${({ theme }) => em(theme.honeycomb.size.tiny)};
  height: ${em(32)};
  display: flex;
`;

export const Positive = styled.span`
  color: ${({ theme }) => theme.honeycomb.color.success.normal};
`;

export const Negative = styled.span`
  color: ${({ theme }) => theme.honeycomb.color.danger.normal};
`;

export const Neutral = styled.span`
  color: ${({ theme }) => theme.honeycomb.color.warning.normal};
`;

export const TabContainer = styled.div`
  display: flex;
  position: relative;
  bottom: -1px;
  height: 40px; /* bad */
  font-size: ${({ theme }) => em(theme.honeycomb.size.normal)};

  li {
    white-space: nowrap;

    ${md`
      width: auto;

      :first-child { width: auto; }
    `}
  }
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
    text-overflow: ellipsis;
  }
`;

export const Filters = styled.div`
  border-top: 1px solid ${({ theme }) => theme.honeycomb.color.border};
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => `${em(theme.honeycomb.size.small)}`};
`;

export const LeftFilter = styled.div`
  color: ${({ theme }) => theme.honeycomb.color.text.masked};
  display: flex;
  flex: 1 0 auto;
  font-size: ${({ theme }) => `${em(theme.honeycomb.size.reduced)}`};

  ${md/* @ts-ignore */ `
     font-size: ${({ theme }) => em(theme.honeycomb.size.small)};
  `}
`;

export const RightFilter = styled.div`
  display: flex;
  flex: 1 0 auto;
  justify-content: flex-end;
`;

export const HashLink = styled.a`
  color: ${({ theme }) => theme.honeycomb.color.text.normal};
`;
