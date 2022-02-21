import React, { createContext, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { BncClient as BNCClient } from '@binance-chain/javascript-sdk';

import { RootState } from '@dex-kit/store/store';

import httpRequest, { NETWORK_ENV } from '@dex-kit/utils/httpRequest';

const GATEWAY = httpRequest.getHttpBaseUri();
export const Context = createContext({});

const SOURCE_ID = 1;

const BNCClientProvider: React.FC = ({ children }) => {
  const client: any = useRef(new BNCClient(GATEWAY, false, SOURCE_ID));
  const { address } = useSelector((state: RootState) => state.account);

  useEffect(() => {
    if (!address) return;
    client.current.initChain();

    if (NETWORK_ENV === 'mainnet') {
      client.current.chooseNetwork('mainnet');
    } else {
      client.current.chooseNetwork('testnet');
    }

    client.current && client.current.account_number && (client.current.account_number = null);
  }, [client, address]);

  return <Context.Provider value={client.current}>{children}</Context.Provider>;
};

export const { Provider, Consumer } = Context;

export default BNCClientProvider;
