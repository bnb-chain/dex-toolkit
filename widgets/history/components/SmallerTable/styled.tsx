import styled from 'styled-components';
import { em } from 'polished';
import { Card } from '@binance-chain/honeycomb';

export const StyledCard = styled(Card)`
  flex: 1 0 auto;
  max-height: ${em(500)};
  overflow: auto;
`;

export const Container = styled.div`
  display: flex;
  padding: ${({ theme }) => em(theme.honeycomb.size.small)};
`;

export const RowContainer = styled.div`
  display: flex;
  flex-direction: column;

  &:not(:first-child) {
    padding-top: ${({ theme }) => em(theme.honeycomb.size.normal)};
  }

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.honeycomb.color.border};
  }
`;

export const Brief = styled.div`
  display: flex;
  font-size: ${({ theme }) => em(theme.honeycomb.size.reduced)};
  justify-content: space-between;
  padding-bottom: ${({ theme }) => em(theme.honeycomb.size.normal)};
`;

export const LeftBrief = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
`;

export const RightBrief = styled.div`
  display: flex;

  > a {
    padding-right: 0;
    height: 1.5em;
  }
`;

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: ${({ theme }) => em(theme.honeycomb.size.small)};
`;

export const Header = styled.div`
  color: ${({ theme }) => theme.honeycomb.color.text.masked};
  font-size: ${({ theme }) => em(theme.honeycomb.size.small)};
  display: flex;
`;

export const Cell = styled.div`
  font-size: ${({ theme }) => em(theme.honeycomb.size.small)};
  display: flex;
`;
