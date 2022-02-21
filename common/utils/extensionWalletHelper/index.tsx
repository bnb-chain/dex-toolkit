import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@dex-kit/store/store';
import { setAccount, getAccount } from '@dex-kit/store/account/action';

import { saveAddress } from '../storage';
import { isUnlockWithWalletConnect } from '../account';
import { requestSelectedAddress } from '../extensions';

export const ChainIds = {
  bscMainnet: 56,
  bscTestnet: 97,
  bbcMainnet: 'Binance-Chain-Tigris',
  bbcTestnet: 'Binance-Chain-Ganges',
  ethMainnet: 1,
  eth2ndMainnet: '0x01',
};

export const getNetworkByChainId = (chainId: number | string) => {
  let network = {
    id: 'bsc-mainnet',
    name: 'Binance Smart Chain Mainnet',
  };
  switch (chainId) {
    case ChainIds.bscMainnet:
      network = {
        id: 'bsc-mainnet',
        name: 'Binance Smart Chain Mainnet',
      };
      break;
    case ChainIds.bscTestnet:
      network = {
        id: 'bsc-testnet',
        name: 'Binance Smart Chain Testnet',
      };
      break;
    case ChainIds.bbcMainnet:
      network = {
        id: 'bbc-mainnet',
        name: 'Binance Chain Mainnet',
      };
      break;
    case ChainIds.bbcTestnet:
      network = {
        id: 'bbc-testnet',
        name: 'Binance Chain Testnet',
      };
      break;
    case ChainIds.ethMainnet:
    case ChainIds.eth2ndMainnet:
      network = {
        id: 'eth-mainnet',
        name: 'Ethereum Network',
      };
      break;
    default:
      break;
  }
  return network;
};

// just render on client side
export const ExtensionWalletHelper = () => {
  const dispatch = useDispatch();
  const { deviceInfo } = useSelector((state: RootState) => state.globalData);

  useEffect(() => {
    const timer = setTimeout(() => {
      // eslint-disable-next-line
      // @ts-ignore: Object is of type 'unknown'.
      const { BinanceChain } = window;
      if (!BinanceChain) return;
      if (isUnlockWithWalletConnect()) return;

      BinanceChain.on('connect', ({ chainId }: { chainId: string }) => {
        dispatch(
          setAccount({
            network: getNetworkByChainId(chainId),
          }),
        );
      });

      BinanceChain.on('accountsChanged', (accounts: Array<any>) => {
        console.log('BinanceChain accounts changed. New accounts are ', accounts);
        saveAddress(accounts[0], {
          keystore: 'HARDWARE',
          flags: { isWalletConnect: false, isExtensionWallet: true },
        });
        dispatch(getAccount(accounts[0]));
        dispatch(
          setAccount({
            address: accounts[0],
            flags: { isWalletConnect: false, isExtensionWallet: true },
            privateKey: 'HARDWARE',
          }),
        );
        window.location.reload();
      });

      BinanceChain.on('chainChanged', async (chainId: string) => {
        console.log(
          'BinanceChain chain changed. New chain: ',
          chainId,
          getNetworkByChainId(chainId),
        );
        const address = await requestSelectedAddress();
        saveAddress(address, {
          keystore: 'HARDWARE',
          flags: { isWalletConnect: false, isExtensionWallet: true },
        });
        dispatch(getAccount(address));
        dispatch(
          setAccount({
            address,
            network: getNetworkByChainId(chainId),
            flags: { isWalletConnect: false, isExtensionWallet: true },
            privateKey: 'HARDWARE',
          }),
        );
      });

      BinanceChain.on('disconnect', () => {
        console.log('disconnected from extension wallet ');
      });
    }, 2000);
    return () => clearTimeout(timer);
  }, [dispatch, deviceInfo]);

  return <></>;
};
