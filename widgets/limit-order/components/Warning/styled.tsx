import styled from 'styled-components';

import { Icon } from '@dex-kit/utils/icons';

export const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const StyledIcon = styled(Icon.RequestConnect)`
  fill: ${({ theme }) => theme.honeycomb.color.primary.normal};
`;
