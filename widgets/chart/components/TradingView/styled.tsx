import styled, { createGlobalStyle } from 'styled-components';

import { ChartContainer, CHART_HEIGHT } from '../styled';

export const GlobalStyle = createGlobalStyle`
  .tv-loading-spinner,
  .ant-spin-container {
    flex: 1 1 auto;
    flex-basis: ${CHART_HEIGHT}px;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
  }
  .tv-loading-spinner.hidden {
    display: none;
  }
`;

export const TradingViewChartContainer = styled(ChartContainer)`
  clip-path: ${({ theme }) => ''};
`;
