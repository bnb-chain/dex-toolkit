import styled from 'styled-components';
import { Table } from '@binance-chain/honeycomb';
import { em } from 'polished';

import { mediaQuery } from '@dex-kit/utils';

const { md } = mediaQuery;

export const Container = styled.div`
  background-color: ${({ theme }) => theme.honeycomb.color.bg.normal};
  margin-top: ${({ theme }) => em(theme.honeycomb.size.micro / 2)};
  margin-right: ${({ theme }) => em(theme.honeycomb.size.micro / 2)};
  margin-bottom: ${({ theme }) => em(theme.honeycomb.size.micro / 2)};
  display: flex;
  flex-direction: column;

  ${md`
    margin-top: 0;
  `}
`;

export const TableContainer = styled.div<{ isMd?: boolean }>`
  display: flex;
  flex-direction: column;
  height: ${({ isMd }) => (isMd ? em(280) : em(195))};
  overflow: hidden;
  padding: ${({ theme }) => `0 ${em(theme.honeycomb.size.small)}`};
`;

export const StyledTable = styled(Table)`
  width: 100%;

  ${Table.Scroll} {
    display: block;
  }

  ${Table.TheadTr},
  ${Table.TbodyTr} {
    font-size: 12px; /* bad */
    height: ${({ theme }) => em(theme.honeycomb.size.normal, theme.honeycomb.size.small)};
    line-height: ${({ theme }) => em(theme.honeycomb.size.reduced, theme.honeycomb.size.small)};
    padding: ${({ theme }) => em(theme.honeycomb.size.tiny)} 0;
  }

  ${Table.Th},
  ${Table.Td} {
    font-size: 12px; /* bad */
    border-bottom: none !important;
    cursor: pointer;
    width: 33.3%;

    &:not(:first-child) {
      text-align: right;
    }

    &:first-child {
      padding-left: 0;
    }

    &:nth-child(3) {
      padding-right: 0;
    }
  }

  ${Table.Th} {
    padding: ${({ theme }) => `${em(theme.honeycomb.size.tiny)} ${em(theme.honeycomb.size.micro)}`};
  }

  ${Table.Td} {
    font-size: ${({ theme }) => em(theme.honeycomb.size.small, theme.honeycomb.size.small)};
    padding: ${({ theme }) => em(theme.honeycomb.size.micro)};

    &:last-child {
      color: ${({ theme }) => theme.honeycomb.color.text.masked};
    }
  }

  ${Table.TbodyTr} {
    font-size: ${({ theme }) => em(theme.honeycomb.size.small)};
  }
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
  padding: ${({ theme }) => em(theme.honeycomb.size.small)};
  margin: 0;
`;
