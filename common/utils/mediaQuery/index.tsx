import { css } from 'styled-components';

interface Rules {
  xs: Function;
  sm: Function;
  md: Function;
  lg: Function;
  xl: Function;
}

const SIZES = {
  xs: 0,
  sm: 375,
  md: 768,
  lg: 1280,
  xl: 1920,
} as const;

export const mediaQuery = Object.keys(SIZES).reduce((acc: Rules, label: string) => {
  acc[label] = (...args) => css`
    @media (max-width: ${SIZES[label]}px) {
      ${css(...args)};
    }
  `;
  return acc;
}, {} as Rules);
