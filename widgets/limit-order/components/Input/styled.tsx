import styled from 'styled-components';
import { em, transitions } from 'polished';
import { TextInput, HoneycombTheme } from '@binance-chain/honeycomb';

export const Container = styled.div`
  display: flex;
  position: relative;
`;

export const Steps = styled.div`
  display: flex;
  flex-direction: column;
  height: ${em(40)};
  width: ${em(20)};
  margin-left: ${({ theme }) => em(theme.honeycomb.size.micro)};
  justify-content: space-between;
`;

export const Step = styled.button`
  background-color: ${({ theme }) => theme.honeycomb.color.bg.input.normal};
  border: none;
  border-radius: ${({ theme }) => em(theme.honeycomb.radius.reduced)};
  color: ${({ theme }) => theme.honeycomb.color.text.normal};
  cursor: pointer;
  height: 18px;
  line-height: 24px;
  width: 20px;
  padding: 0;
  ${({ theme }) => transitions(['background', 'color', 'border'], theme.honeycomb.duration.normal)};

  &:hover {
    background-color: ${({ theme }) => theme.honeycomb.color.primary.active};
    color: ${({ theme }) =>
      theme.honeycomb.color.readable.normal(theme.honeycomb.color.primary.active)};
  }
`;

export const Right = styled.span`
  color: ${({ theme }) => theme.honeycomb.color.text.masked};
`;

export const StyledTextInput = styled(TextInput)<{
  showMaxAmount?: boolean;
  error?: boolean | undefined;
}>`
  ${TextInput.Input} {
    -moz-appearance: none;
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }
    &::placeholder {
      color: ${({ theme }) => theme.honeycomb.color.text.placeholder};
      font-size: ${({ theme }) => em(theme.honeycomb.size.small, theme.honeycomb.size.reduced)};
    }
  }

  ${TextInput.InputContainer} {
    ${({ theme, showMaxAmount }) =>
      showMaxAmount &&
      `border-color: ${theme.honeycomb.color.primary.normal}; border-radius: 8px 8px 0 0;`}
    ${({ theme, error }) =>
      error && `border-color: ${theme.honeycomb.color.danger.normal}; border-radius: 8px 8px 0 0;`}
  }
`;

export const Hint = styled.div<{ showMaxAmount?: boolean; error?: boolean }>`
  font-size: ${({ theme }) => em(theme.honeycomb.size.small)};
  padding-top: ${({ theme }) => em(theme.honeycomb.size.micro, theme.honeycomb.size.normal)};
  padding-bottom: ${({ theme }) => em(theme.honeycomb.size.micro, theme.honeycomb.size.normal)};
  padding-left: ${({ theme }) => em(theme.honeycomb.size.small, theme.honeycomb.size.normal)};
  padding-right: ${({ theme }) => em(theme.honeycomb.size.small, theme.honeycomb.size.normal)};
  width: calc(100% - 24px);
  position: absolute;
  bottom: -20px;
  z-index: 100;
  border-radius: 0 0 8px 8px;

  ${({ theme, showMaxAmount }) =>
    showMaxAmount &&
    `background-color: ${theme.honeycomb.color.primary.normal}; color: ${HoneycombTheme.GoldLight.honeycomb.color.text.normal};`}
  ${({ theme, error }) =>
    error &&
    `background-color: ${theme.honeycomb.color.danger.normal}; color: ${HoneycombTheme.GoldDark.honeycomb.color.text.normal};`}
`;
