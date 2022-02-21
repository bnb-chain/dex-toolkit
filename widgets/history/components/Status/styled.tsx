import styled from 'styled-components';
import { em } from 'polished';
import { Badge } from '@binance-chain/honeycomb';

export const StyledBadge = styled(Badge)`
  line-height: ${({ theme }) => em(theme.honeycomb.size.large)};
`;
