import { useCallback } from 'react';

import { useAppSelector } from '@dex-kit/hooks';

export const useAssetBalance = () => {
  const {
    account: { userInfo },
  } = useAppSelector((state) => state);

  const getBalance = useCallback(
    (asset) => {
      const balances = userInfo.balances || [];
      for (let i = 0, len = balances.length; i < len; i++) {
        if (asset === balances[i].symbol) {
          return balances[i].free;
        }
      }

      return 0;
    },
    [userInfo.balances],
  );

  return {
    getBalance,
  };
};
