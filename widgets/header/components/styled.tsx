import styled, { createGlobalStyle } from 'styled-components';
import { em } from 'polished';

export const GlobalStyles = createGlobalStyle`
  .accelerated-button {
    height: ${em(62)};
  }

  [data-testid='left.dropdown.target'] {
    position: relative;

    svg {
      position: absolute;
      right: 1.25em;
      bottom: .5em;
    }
  }
`;

export const Link = styled.a`
  text-decoration: none;

  &:visited {
    text-decoration: none;
  }
`;
