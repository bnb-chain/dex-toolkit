import styled from 'styled-components';
import { Table } from '@binance-chain/honeycomb';
import { em } from 'polished';

export const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: ${em(174)};
`;

export const StyledTable = styled(Table)`
  padding: ${({ theme }) => `${em(theme.honeycomb.size.tiny)} ${em(theme.honeycomb.size.small)}`};

  ${Table.Scroll} {
    display: block;
  }

  ${Table.TheadTr},
  ${Table.TbodyTr} {
    font-size: 12px; /* bad */
    height: ${({ theme }) => em(theme.honeycomb.size.increased, theme.honeycomb.size.normal)};
    padding: ${({ theme }) => em(theme.honeycomb.size.tiny)} 0;
  }

  ${Table.TheadTr} {
    font-size: ${({ theme }) => em(theme.honeycomb.size.normal, theme.honeycomb.size.reduced)};
  }

  ${Table.Th},
  ${Table.Td} {
    border-bottom: none !important;
    font-size: 12px; /* bad */
    padding: 0;
    cursor: pointer;
    width: 27.5%;

    &:first-child {
      width: 45%;
    }

    &:last-child {
      text-align: right;

      > div {
        display: inline-flex;
      }
    }
  }
`;

export const Positive = styled.span`
  color: ${({ theme }) => theme.honeycomb.color.success.normal};
`;

export const Negative = styled.span`
  color: ${({ theme }) => theme.honeycomb.color.danger.normal};
`;

export const PairContainer = styled.div`
  align-items: center;
  display: flex;
`;

export const Setter = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  margin: 0;
  padding: 0;
`;
