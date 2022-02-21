import { Space } from '@binance-chain/honeycomb';

import { Container, StyledIcon } from './styled';

export const Empty = () => (
  <Container>
    <StyledIcon />
    <Space size="tiny" />
    There is no result for now.
  </Container>
);
