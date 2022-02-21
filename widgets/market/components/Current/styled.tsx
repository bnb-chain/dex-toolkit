import styled from 'styled-components';
import { em } from 'polished';

import { mediaQuery } from '@dex-kit/utils';

const { md } = mediaQuery;

export const TradePair = styled.div`
  display: flex;
  font-size: ${({ theme }) => em(theme.honeycomb.size.increased)};
  font-weight: bold;
  color: ${({ theme }) => theme.fontColor};
  white-space: nowrap;

  ${md`
    font-size: 16px;
  `}
`;

export const SymbolName = styled.a`
  display: flex;
  align-content: center;
  font-size: ${({ theme }) => em(theme.honeycomb.size.small)};
  cursor: pointer;
  color: ${({ theme }) => theme.honeycomb.color.text.masked};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const Container = styled.ul`
  display: flex;
  flex-direction: row;
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 5em;
  justify-content: space-between;

  ${md`
    flex-direction: column; max-height: 100%;
    padding: ${({ theme }) => em(theme.honeycomb.size.small)};
  `}
`;

export const MiddleViewContainer = styled.div`
  display: flex;
  cursor: pointer;
`;

export const Item = styled.li`
  display: flex;
  flex-direction: column;
  padding: 12px;
  padding-bottom: 0;
  line-height: 28px;

  ${md`
    padding: ${({ theme }) => em(theme.honeycomb.size.micro)};
  `}
`;
