import styled from 'styled-components';
import { em } from 'polished';

export const Circle = styled.span<{ status?: string }>`
  background-color: ${({ theme, status }) => {
    if (status === 'success') return theme.honeycomb.color.success.normal;
    if (status === 'danger') return theme.honeycomb.color.danger.normal;
    if (status === 'warning') return theme.honeycomb.color.warning.normal;
    return theme.honeycomb.color.text.normal;
  }};
  display: flex;
  flex: 1 0 auto;
  width: 4px;
  height: 4px;
  border-radius: 50%;

  &:hover {
    background-color: ${({ theme, status }) => {
      if (status === 'success') return theme.honeycomb.color.success.normal;
      if (status === 'danger') return theme.honeycomb.color.danger.normal;
      if (status === 'warning') return theme.honeycomb.color.warning.normal;
      return theme.honeycomb.color.text.normal;
    }};
  }
`;

export const DateTime = styled.span`
  color: ${({ theme }) => theme.honeycomb.color.text.masked};
`;

export const Latency = styled.div<{ status?: string }>`
  color: ${({ theme, status }) => {
    if (status === 'success') return theme.honeycomb.color.success.normal;
    if (status === 'danger') return theme.honeycomb.color.danger.normal;
    if (status === 'warning') return theme.honeycomb.color.warning.normal;
    return theme.honeycomb.color.text.normal;
  }};
  display: flex;
  align-items: center;
`;

export const Container = styled.div`
  display: flex;
  padding: ${({ theme }) => em(theme.honeycomb.size.small)} 0;
`;

export const Inner = styled.div`
  display: flex;
  flex-basis: 100%;
  flex-direction: column;
`;

export const InnerText = styled.div`
  color: ${({ theme }) => theme.honeycomb.color.text.masked};
  font-size: ${({ theme }) => em(theme.honeycomb.size.small, theme.honeycomb.size.reduced)};
  line-height: ${({ theme }) => em(theme.honeycomb.size.reduced, theme.honeycomb.size.normal)};
  display: flex;
  padding-left: ${({ theme }) => em(theme.honeycomb.size.reduced)};
`;

export const InnerBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => em(theme.honeycomb.size.micro)} 0;
`;

export const Selected = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const SelectedInner = styled.div`
  font-size: ${({ theme }) => em(theme.honeycomb.size.small, theme.honeycomb.size.reduced)};
  line-height: ${({ theme }) => em(theme.honeycomb.size.reduced, theme.honeycomb.size.normal)};
  display: flex;
  justify-content: space-between;
`;
