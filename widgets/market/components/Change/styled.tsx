import styled from 'styled-components';
import { em } from 'polished';

import { mediaQuery } from '@dex-kit/utils';

const { md } = mediaQuery;

export const Container = styled.ul`
  display: flex;
  flex-direction: row;
  font-size: ${({ theme }) => em(theme.honeycomb.size.small)};
  list-style: none;
  padding: 0;
  margin: 0;
  align-items: center;
  max-height: 5em;

  ${md`
    align-items: flex-end; flex-direction: column; max-height: 100%; justify-content: center;
    padding: ${({ theme }) => em(theme.honeycomb.size.small)};
  `}
`;

export const Title = styled.span`
  color: ${({ theme }) => theme.honeycomb.color.text.masked};

  ${md`
      padding-right: ${({ theme }) => em(theme.honeycomb.size.micro)};;
   `}
`;

export const Item = styled.li`
  display: flex;
  flex-direction: column;
  padding: 12px;

  ${md`
    flex-direction: row; justify-content: space-between;
    padding: ${({ theme }) => em(theme.honeycomb.size.micro)};
  `}
`;
