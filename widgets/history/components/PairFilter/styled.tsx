import styled from 'styled-components';
import { em } from 'polished';
import { Dropdown, Select } from '@binance-chain/honeycomb';

export const Container = styled.div`
  color: ${({ theme }) => theme.honeycomb.color.text.masked};
  font-size: ${({ theme }) => em(theme.honeycomb.size.reduced, theme.honeycomb.size.normal)};
  display: flex;
  flex: 0 0 250px;
  justify-content: flex-end;
  align-items: center;

  [data-testid='target'] {
    button {
      border-radius: 4px;
      height: ${em(32)};
      padding: ${({ theme }) => `${em(theme.honeycomb.size.micro)} 8px`}; /* bad */
      display: flex;
      justify-content: space-between;
    }
  }

  [data-testid='dropdown.target'] {
    > div {
      border-radius: 4px;
      height: ${em(32)};
      padding: 0 8px; /* bad */
    }
  }
`;

export const StyledDropdownDefaultTarget = styled(Dropdown.DefaultTarget)`
  width: 72px; /* bad */
`;

export const StyledSelectDefaultTarget = styled(Select.DefaultTarget)`
  width: 72px; /* bad */
`;
