import { useMemo, useState } from 'react';
import { Dropdown, Icon, Space, Card } from '@binance-chain/honeycomb';

import { EXPLORER_URL } from '@dex-kit/utils/httpRequest';
import { useWindowSize, useAppSelector } from '@dex-kit/hooks';

import { Pairs } from '@widget/pairs';

import { LastPrice } from '../LastPrice';
import { USDPrice } from '../USDPrice';

import { TradePair, SymbolName, Container, MiddleViewContainer, Item } from './styled';

export const Current = () => {
  const {
    exchange: { currentTrade, tokens },
  } = useAppSelector((state) => state);

  const [open, setOpen] = useState(false);

  const { isMd } = useWindowSize();

  const pair = useMemo(() => currentTrade.split('_'), [currentTrade]);
  /* @ts-ignore */
  const token = useMemo(() => tokens.find((t) => t.symbol === pair[0]) || {}, [pair, tokens]);

  return (
    <Container>
      <Item>
        {isMd ? (
          <MiddleViewContainer>
            <Dropdown
              target={
                <>
                  <TradePair>
                    {pair[0] && pair[0].replace(/[.-].+/, '')}
                    {' / '}
                    {pair[1] && pair[1].replace(/[.-].+/, '')}
                  </TradePair>
                  <Space size="tiny" />
                  {open ? <Icon.TriangleUp fontSize={18} /> : <Icon.TriangleDown fontSize={18} />}
                </>
              }
              bare={true}
              onClick={() => setOpen(!open)}
            >
              <Card>
                <Pairs />
              </Card>
            </Dropdown>
          </MiddleViewContainer>
        ) : (
          <>
            <TradePair>
              {pair[0] && pair[0].replace(/[.-].+/, '')}
              {' / '}
              {pair[1] && pair[1].replace(/[.-].+/, '')}
            </TradePair>
          </>
        )}
        {!isMd && (
          <>
            <SymbolName
              target="_blank"
              title={token.name}
              href={`${EXPLORER_URL}/asset/${pair[0]}`}
              rel="noreferrer"
            >
              {token.name}
            </SymbolName>
            {token.token_type && <>MiniToken</>}
          </>
        )}
      </Item>
      <Item>
        <>
          <LastPrice />
          <USDPrice />
        </>
      </Item>
    </Container>
  );
};
