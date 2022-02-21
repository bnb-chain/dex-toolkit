import styled from 'styled-components';
import { em } from 'polished';
import { Button, Dropdown, HoneycombTheme } from '@binance-chain/honeycomb';
import { mediaQuery } from '@dex-kit/utils';

const { lg } = mediaQuery;

export const CHART_HEIGHT = 360;

export const ChartContainer = styled.div<{ hidden: boolean; fullscreen: boolean }>`
  display: ${({ hidden }) => (hidden ? 'none' : 'flex')} !important;
  flex: 1 1 auto;
  /* must be set in pixels for tradingview. */
  flex-basis: ${({ hidden, fullscreen }) => (!hidden && fullscreen ? '95%' : `${CHART_HEIGHT}px`)};
  height: 100%;
  outline: 0;
  overflow: hidden;
  position: relative;
  width: 100%;

  & .showHand {
    cursor: auto !important;
  }

  & canvas {
    position: absolute;
    user-select: none;
    width: 100%;
    height: 100%;
  }

  & .tradingview-widget-container {
    &,
    & > div {
      bottom: 0;
      height: 100%;
      position: absolute;
      top: 0;
      width: 100%;
    }
  }
`;

export const Container = styled.div<{ fullscreen: boolean }>`
  background-color: ${({ theme }) => theme.honeycomb.color.bg.normal};
  margin: ${({ theme }) => em(theme.honeycomb.size.micro / 2)};
  margin-top: 0;
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: ${({ theme }) => em(theme.honeycomb.size.small)};

  ${({ fullscreen }) =>
    fullscreen &&
    `
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 10;
  `};

  ${lg`
    margin-left: 0;
  `}
`;

export const PanelContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const Left = styled.div`
  display: flex;
  flex: 1;
`;

export const Right = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
`;

export const DefaultTarget = styled(Dropdown.DefaultTarget)<{ active: boolean }>`
  border-radius: ${({ theme }) => em(theme.honeycomb.size.micro)};
  font-size: ${({ theme }) => em(theme.honeycomb.size.small)};
  padding: 0 ${({ theme }) => em(theme.honeycomb.size.tiny)};
  height: ${em(32)};
  display: flex;

  ${({ theme, active }) =>
    active &&
    `
    background-color: ${theme.honeycomb.color.primary.normal};
    color: ${HoneycombTheme.GoldLight.honeycomb.color.text.normal};

    svg {
      fill: ${HoneycombTheme.GoldLight.honeycomb.color.text.normal};
    }
  `}
`;

export const StyledUnionButton = styled(Button)`
  &:hover {
    svg {
      fill: ${HoneycombTheme.GoldLight.honeycomb.color.text.normal};
    }
  }
`;
