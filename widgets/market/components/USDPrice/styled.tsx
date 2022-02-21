import styled from 'styled-components';
import { em } from 'polished';

export const Price = styled.span`
  font-size: ${({ theme }) => em(theme.honeycomb.size.small)};
  color: ${({ theme }) => theme.honeycomb.color.text.masked};
  display: flex;
`;
