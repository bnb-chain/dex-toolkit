import { useCallback, useState } from 'react';

import { Tabs } from './Tabs';
import { Balances } from './Balances';
import { TradeHistory } from './Trade';
import { OrderHistory } from './Order';
import { OpenOrders } from './Open';
import { ModalHost } from './ModalHost';

import { Container } from './styled';

const TABS = ['openOrders.title', 'header.orderHistory', 'header.tradeHistory', 'header.balances'];

export const Main = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onTabChange = useCallback((value) => setSelectedIndex(value), []);

  return (
    <Container>
      <>
        <Tabs onTabChange={onTabChange} selectedIndex={selectedIndex} tabs={TABS} />
      </>
      <>
        {selectedIndex === 0 && <OpenOrders />}
        {selectedIndex === 1 && <OrderHistory />}
        {selectedIndex === 2 && <TradeHistory />}
        {selectedIndex === 3 && <Balances />}
      </>
      <ModalHost />
    </Container>
  );
};
