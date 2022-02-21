import { Provider } from 'react-redux';

import { HoneycombThemeProvider, GlobalStyles } from '@binance-chain/honeycomb';
import { ExtensionWalletHelper } from '@dex-kit/utils';
import { store } from '@dex-kit/store/store';

import { Main } from './components';

export const Header = () => {
  return (
    <Provider store={store}>
      <HoneycombThemeProvider family="gold" defaultVariant="light">
        <Main />
        <GlobalStyles />
      </HoneycombThemeProvider>
      <ExtensionWalletHelper />
    </Provider>
  );
};
