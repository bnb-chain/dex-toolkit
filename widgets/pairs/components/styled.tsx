import styled from 'styled-components';
import { em } from 'polished';

export const Container = styled.div`
  background-color: ${({ theme }) => theme.honeycomb.color.bg.normal};
  margin-top: ${({ theme }) => em(theme.honeycomb.size.micro)};
  margin-bottom: ${({ theme }) => em(theme.honeycomb.size.micro / 2)};
  margin-right: ${({ theme }) => em(theme.honeycomb.size.micro / 2)};
  display: flex;
  flex: 1 0;
  flex-direction: column;
`;

export const Filters = styled.div`
  display: flex;
  font-size: ${({ theme }) => em(theme.honeycomb.size.reduced)};
  justify-content: space-between;
  padding: ${({ theme }) => em(theme.honeycomb.size.tiny)};
`;
