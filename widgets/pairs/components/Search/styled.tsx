import styled from 'styled-components';
import { em } from 'polished';
import { TextInput } from '@binance-chain/honeycomb';

export const Container = styled.div`
  display: flex;
  width: ${em(135)};

  input {
    width: 100%;
  }
`;

export const StyledTextInput = styled(TextInput)`
  display: flex;
`;
