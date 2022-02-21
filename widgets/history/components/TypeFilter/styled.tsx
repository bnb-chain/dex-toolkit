import styled from 'styled-components';
import { em } from 'polished';
import { Dropdown } from '@binance-chain/honeycomb';

export const Container = styled.div`
  color: ${({ theme }) => theme.honeycomb.color.text.masked};
  font-size: ${({ theme }) => em(theme.honeycomb.size.reduced, theme.honeycomb.size.normal)};
  display: flex;
  flex: 0 0 160px;
  justify-content: flex-end;
  align-items: center;

  [data-testid='target'] {
    button {
      height: ${em(32)};
      padding: ${({ theme }) => `${em(theme.honeycomb.size.micro)} 8px`}; /* bad */
    }
  }

  [data-testid='dropdown.target'] {
    > div {
      height: ${em(32)};
    }
  }
`;

export const StyledDropdownDefaultTarget = styled(Dropdown.DefaultTarget)`
  border-radius: 4px; /* bad */
  display: flex;
  justify-content: space-between;
  width: 90px; /* bad */
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;
