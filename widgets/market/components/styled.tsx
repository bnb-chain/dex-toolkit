import styled from 'styled-components';
import { em } from 'polished';

import { mediaQuery } from '@dex-kit/utils';

const { md, lg } = mediaQuery;

export const Container = styled.div`
  background-color: ${({ theme }) => theme.honeycomb.color.bg.normal};
  margin: ${({ theme }) => em(theme.honeycomb.size.micro / 2)};
  margin-top: ${({ theme }) => em(theme.honeycomb.size.micro)};
  margin-bottom: 0;
  flex-basis: auto;
  display: flex;
  flex: 1;
  flex-direction: row;

  ${lg`
    flex-direction: column;
    margin-left: 0;
  `}

  ${md`
    flex-direction: row; justify-content: space-between;
  `}
`;

const Value = styled.div`
  display: flex;
  justify-content: flex-start;
  transition: color 0.2s ease;
`;

export const Negative = styled(Value)`
  color: ${({ theme }) => theme.honeycomb.color.danger.normal};
`;

export const Positive = styled(Value)`
  color: ${({ theme }) => theme.honeycomb.color.success.normal};
`;
