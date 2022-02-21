import styled from 'styled-components';
import { Table } from '@binance-chain/honeycomb';
import { em } from 'polished';

import { mediaQuery } from '@dex-kit/utils';

const { md, lg } = mediaQuery;

export const Container = styled.div`
  background-color: ${({ theme }) => theme.honeycomb.color.bg.normal};
  margin-top: ${({ theme }) => em(theme.honeycomb.size.micro)};
  margin-left: ${({ theme }) => em(theme.honeycomb.size.micro / 2)};
  margin-bottom: ${({ theme }) => em(theme.honeycomb.size.micro / 2)};
  padding: ${({ theme }) => `${em(theme.honeycomb.size.tiny)} 0`};
  display: flex;
  flex-direction: column;
  width: ${em(315)};

  ${lg`
    width: auto;
  `}

  ${md`
    margin-top: 0;
  `}
`;

export const TableContainer = styled.div<{ full: boolean }>`
  display: flex;
  flex-direction: column;
  height: ${({ full }) => (full ? em(370) : em(185))};
  padding: ${({ theme }) => `0 ${em(theme.honeycomb.size.small)}`};
  position: relative;

  ${lg`
    height: ${({ full }) => (full ? '440px' : '220px')};
  `}
`;

export const StyledTable = styled(Table)<{ full?: boolean }>`
  min-width: ${em(290)};
  width: 100%;
  position: relative;
  bottom: 0;

  ${Table.Scroll} {
    overflow: ${({ full }) => (full ? 'auto' : 'hidden')};
    display: block;
    position: relative;
  }

  ${Table.TheadTr},
  ${Table.TbodyTr} {
    height: ${({ theme }) => em(20, theme.honeycomb.size.normal)};
    line-height: ${({ theme }) => em(theme.honeycomb.size.reduced, theme.honeycomb.size.small)};
    max-height: ${({ theme }) => em(theme.honeycomb.size.normal, theme.honeycomb.size.small)};
    position: relative;
  }

  ${Table.TheadTr} {
    font-size: ${({ theme }) => em(theme.honeycomb.size.small, theme.honeycomb.size.small)};
    z-index: 100;
  }

  ${Table.Th},
  ${Table.Td} {
    font-size: 12px; /* bad */
    border-bottom: none !important;
    cursor: pointer;
    padding-left: ${({ theme }) => em(theme.honeycomb.size.tiny / 2)};
    z-index: 10;

    &:not(:first-child) {
      text-align: right;
    }

    &:first-child {
      padding-left: 0;
    }
  }
  ${Table.Th},
  ${Table.Td} {
    &:nth-child(3) {
      padding-right: 0;
    }
  }

  ${Table.TheadTr},
  ${Table.TbodyTr} {
    transform: scale(1); // A hack for positioning
  }

  ${Table.Th},
  ${Table.Td} {
    &:last-child {
      position: absolute;
      right: 0;
      height: 18px;
      z-index: 0;
    }
  }

  ${Table.Td} {
    position: relative;

    &:last-child {
      opacity: 0.1;
      padding: 0;
      width: 100%;

      .data-cell {
        float: right;
        height: 18px;
      }
    }
  }

  &.data-asks {
    ${Table.Table} {
      display: block;
      position: ${({ full }) => (full ? 'relative' : 'absolute')};
      ${({ full }) => !full && 'bottom: 0;'}
      white-space: nowrap;

      tbody {
        position: relative;
        display: table;
        width: 100%;
      }
    }

    ${Table.Scroll} {
      height: ${({ full }) => (full ? em(370) : em(185))};
      bottom: 0;

      ${lg`
        height: ${({ full }) => (full ? '440px' : '220px')};
      `}
    }

    ${Table.Td} {
      &:last-child .data-asks-cell.data-cell {
        background-color: ${({ theme }) => theme.honeycomb.color.sell.normal};
      }
    }
  }

  &.data-bids {
    ${Table.Td} {
      &:last-child .data-bids-cell.data-cell {
        background-color: ${({ theme }) => theme.honeycomb.color.buy.normal};
      }
    }
  }

  ${Table.TbodyTr} {
    ${({ data }) =>
      data.map((el: any, index) =>
        `:nth-child(${index + 1}) ${Table.Td}:last-child .data-cell { width: ${
          Number.isNaN(el.median) ? 0 : el.median
        }%; }`.trim(),
      )}
  }
`;

export const DumbHeader = styled(StyledTable)`
  padding: ${({ theme }) => `${em(theme.honeycomb.size.tiny)} ${em(theme.honeycomb.size.small)}`};
  padding-bottom: 0;

  ${Table.Th} {
    width: 26.25%;

    &:nth-child(2) {
      width: 47.5%;
    }

    ${md`
      width: 27%;

      &:nth-child(2) { width: 46%; }
    `}
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

export const LastPriceContainer = styled.div`
  font-size: ${({ theme }) => em(theme.honeycomb.size.normal, theme.honeycomb.size.normal)};
`;

export const USDPriceContainer = styled.div`
  font-size: ${({ theme }) => em(20, theme.honeycomb.size.normal)};
`;

export const PriceInner = styled.div`
  display: flex;
  align-items: center;
`;

export const Filters = styled.ul`
  border-bottom: 1px solid ${({ theme }) => theme.honeycomb.color.border};
  display: flex;
  list-style: none;
  padding: ${({ theme }) =>
    `0 ${em(theme.honeycomb.size.small)} ${em(theme.honeycomb.size.tiny)} `};
  margin: 0;
`;

export const Filter = styled.li<{ active: boolean }>`
  background-color: ${({ theme, active }) =>
    active ? theme.honeycomb.color.bg.input.normal : 'transparent'};
  border: 1px solid
    ${({ theme, active }) => (active ? theme.honeycomb.color.primary.normal : 'transparent')};
  border-radius: ${({ theme }) => em(theme.honeycomb.size.micro)};
  cursor: pointer;
  display: flex;
  height: ${em(24)};
  width: ${em(28)};
  justify-content: center;
  align-items: center;
`;

export const Setter = styled.button`
  color: ${({ theme }) => theme.honeycomb.color.text.normal};
  cursor: pointer;
  background: none;
  border: none;
  margin: 0;
  padding: 0;
  font-size: 12px; /* bad */
`;
