import { useState, useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { useParams } from 'react-router-dom';
import { FormattedMessage, IntlProvider } from 'react-intl';
import { HoneycombThemeProvider, ToastProvider } from '@binance-chain/honeycomb';

import httpRequest from '@dex-kit/utils/httpRequest';
import { store } from '@dex-kit/store/store';
import { useWindowSize } from '@dex-kit/hooks';
import BNCClientProvider from '@dex-kit/context/BNCClientProvider';
import WalletConnectProvider from '@dex-kit/context/WalletConnectProvider';
import ExtensionWalletProvider from '@dex-kit/context/ExtensionWalletProvider';
import CommonDataProvider from '@dex-kit/utils/network/CommonDataProvider';
import AggregateDataProvider from '@dex-kit/utils/network/AggregateDataProvider';
import AccountDataProvider from '@dex-kit/utils/network/AccountDataProvider';
import { SMARTLING_LOCALES } from '@dex-kit/utils/locales';

import { Chart } from '@widget/chart';
import { Market } from '@widget/market';
import { OrderBook } from '@widget/order-book';
import { Header } from '@widget/header';
import { History } from '@widget/history';
import { Pairs } from '@widget/pairs';
import { Trades } from '@widget/trades';
import { LimitOrder } from '@widget/limit-order';

import {
  Body,
  LeftContainer,
  Layer,
  SmallViewportBottomLayer,
  ColumnLayer,
  Top,
  SmallViewportLimitOrder,
  StyledSegmentedControl,
} from './components';

const TABS = ['exchange.index.chart', 'Order Book', 'Trades'];

const App = () => {
  const [messages, setMessages] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { locale } = useParams<{ locale: string }>();
  const { isSm, isMd } = useWindowSize();
  const prevLocale = useRef(locale);

  useEffect(() => {
    if (Object.keys(messages).length > 0 && locale === prevLocale.current) return;
    if (locale !== prevLocale.current) prevLocale.current = locale;
    httpRequest.getI18nData(SMARTLING_LOCALES[locale]).then((el: Object) => setMessages(el));
  }, [locale, messages, prevLocale]);

  if (Object.keys(messages).length === 0) return null;
  return (
    <IntlProvider messages={messages} locale={locale}>
      <HoneycombThemeProvider>
        <Provider store={store}>
          {/* @ts-ignore */}
          <BNCClientProvider>
            {/* @ts-ignore */}
            <WalletConnectProvider>
              <main>
                <Header />
                <Body>
                  {isSm ? (
                    <>
                      <Top>
                        <Market />
                        <StyledSegmentedControl
                          variant="tab"
                          selectedIndex={selectedIndex}
                          role="menu"
                        >
                          {TABS.map((el, index) => (
                            <div
                              onClick={() => setSelectedIndex(index)}
                              role="menuitem"
                              tabIndex={index}
                              aria-hidden="true"
                            >
                              <FormattedMessage id={el} />
                            </div>
                          ))}
                        </StyledSegmentedControl>
                        <>
                          {selectedIndex === 0 && <Chart />}
                          {selectedIndex === 1 && <OrderBook />}
                          {selectedIndex === 2 && <Trades />}
                        </>
                      </Top>
                      <SmallViewportBottomLayer>
                        <History />
                      </SmallViewportBottomLayer>
                      <SmallViewportLimitOrder>
                        <LimitOrder />
                      </SmallViewportLimitOrder>
                    </>
                  ) : (
                    <>
                      {isMd ? (
                        <>
                          <Top>
                            <ColumnLayer>
                              <Market />
                              <Chart />
                            </ColumnLayer>
                            <OrderBook />
                          </Top>
                          <Layer>
                            <Trades />
                            <LimitOrder />
                          </Layer>
                          <Layer>
                            <History />
                          </Layer>
                        </>
                      ) : (
                        <>
                          <Top>
                            <LeftContainer>
                              <Pairs />
                              <Trades />
                            </LeftContainer>
                            <ColumnLayer>
                              <Market />
                              <Chart />
                            </ColumnLayer>
                            <OrderBook />
                          </Top>
                          <Layer>
                            <History />
                            <LimitOrder />
                          </Layer>
                        </>
                      )}
                    </>
                  )}
                </Body>
              </main>
            </WalletConnectProvider>
          </BNCClientProvider>
          <CommonDataProvider />
          <AggregateDataProvider />
          <AccountDataProvider />
          <ExtensionWalletProvider />
          <ToastProvider position="top-right" />
        </Provider>
      </HoneycombThemeProvider>
    </IntlProvider>
  );
};

export default App;
