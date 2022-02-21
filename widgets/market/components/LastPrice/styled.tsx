import styled from 'styled-components';
import { em } from 'polished';

export const Wrapper = styled.div`
  display: flex;
  font-size: ${({ theme }) => em(theme.honeycomb.size.increased)};
  font-weight: bold;
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
