import styled from 'styled-components';

export const TabInner = styled.div<{ selected?: boolean }>`
  display: flex;
  flex: 1;
  justify-content: center;
  color: ${({ theme, selected }) =>
    selected ? theme.honeycomb.color.primary.normal : theme.honeycomb.color.text.masked};
  cursor: pointer;
`;
