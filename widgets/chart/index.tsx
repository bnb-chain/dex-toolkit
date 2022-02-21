import { Provider } from 'react-redux';
import { HoneycombThemeProvider, GlobalStyles } from '@binance-chain/honeycomb';
import { store } from '@dex-kit/store/store';

import { getTVThemes } from './themes';
import { Main } from './components';

export const Chart = () => {
  return (
    <Provider store={store}>
      <HoneycombThemeProvider localTheme={getTVThemes()}>
        <Main />
        <GlobalStyles />
      </HoneycombThemeProvider>
    </Provider>
  );
};
