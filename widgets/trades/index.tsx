import { Provider } from 'react-redux';
import { HoneycombThemeProvider, GlobalStyles } from '@binance-chain/honeycomb';

import { store } from '@dex-kit/store/store';

import { Main } from './components/';

export const Trades = () => {
  return (
    <Provider store={store}>
      <HoneycombThemeProvider>
        <Main />
        <GlobalStyles />
      </HoneycombThemeProvider>
    </Provider>
  );
};
