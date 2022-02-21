import styled from 'styled-components';
import { em } from 'polished';

export const Container = styled.div`
  display: flex;
  flex: 1 0;
  justify-content: space-around;
  align-items: center;
`;

export const RadioContainer = styled.div`
  padding: ${({ theme }) => `0 ${em(theme.honeycomb.size.micro)}`};

  label {
    color: ${({ theme }) => theme.honeycomb.color.text.masked};
  }
`;
