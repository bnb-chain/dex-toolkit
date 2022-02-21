import styled from 'styled-components';
import { em } from 'polished';

import { Icon } from '@dex-kit/utils/icons';

export const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  font-size: ${({ theme }) => em(theme.honeycomb.size.small)};
  height: ${em(220)};
  justify-content: center;
`;

export const StyledIcon = styled(Icon.EmptyResult)`
  fill: ${({ theme }) => theme.honeycomb.color.text.masked};
`;
