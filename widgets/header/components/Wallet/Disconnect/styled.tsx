import styled, { createGlobalStyle } from 'styled-components';
import { em } from 'polished';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const CTAContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  margin-top: ${({ theme }) => em(theme.honeycomb.size.increased)};
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex: 1 0 90%;
`;

export const GlobalStyle = createGlobalStyle`
  .ReactModal__Content {
    width: auto;
  }
`;
