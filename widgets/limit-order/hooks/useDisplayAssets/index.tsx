import { useMemo } from 'react';

import { useAppSelector } from '@dex-kit/hooks';

export const useDisplayAssets = () => {
  const {
    exchange: { currentTrade, displayCurrentTrade },
  } = useAppSelector((state) => state);

  const [baseAsset, quoteAsset] = useMemo(() => currentTrade.split('_'), [currentTrade]);

  const [displayBaseAsset, displayQuoteAsset] = useMemo(
    () => displayCurrentTrade.split('_').map((el: string) => el.replace(/-.+/i, '')),
    [displayCurrentTrade],
  );

  return {
    baseAsset,
    quoteAsset,
    displayBaseAsset,
    displayQuoteAsset,
  };
};
