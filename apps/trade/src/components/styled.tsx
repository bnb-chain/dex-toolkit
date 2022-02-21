import styled from 'styled-components';
import { em } from 'polished';
import { SegmentedControl } from '@binance-chain/honeycomb';

import { mediaQuery } from '@dex-kit/utils';

const { md } = mediaQuery;

export const Body = styled.div`
  display: flex;
  flex-direction: column;
`;

export const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: ${em(475)};
  width: ${em(290)};
`;

export const Layer = styled.div`
  display: flex;
`;

export const Top = styled(Layer)`
  flex-direction: row;

  ${md`
    flex-direction: column;
  `}
`;

export const ColumnLayer = styled(Layer)`
  flex: 1;
  flex-direction: column;
`;

export const SmallViewportBottomLayer = styled(Layer)`
  padding-bottom: ${em(72)};
`;

export const SmallViewportLimitOrder = styled(Layer)`
  background-color: ${({ theme }) => theme.honeycomb.color.bg.normal};
  box-shadow: ${({ theme }) => theme.honeycomb.shadow.box.normal};
  padding: ${({ theme }) => `${em(theme.honeycomb.size.normal)}`};
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

export const StyledSegmentedControl = styled(SegmentedControl)`
  background-color: ${({ theme }) => theme.honeycomb.color.bg.normal};
`;
