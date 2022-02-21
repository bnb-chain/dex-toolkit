import styled from 'styled-components';
import { em } from 'polished';

export const Total = styled.span`
  color: ${({ theme }) => theme.honeycomb.color.text.normal};
`;

export const EstimatedValue = styled.div`
  display: flex;
  flex: 1;
  font-size: ${({ theme }) => em(theme.honeycomb.size.small, theme.honeycomb.size.reduced)};
`;
