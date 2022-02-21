import { FormattedMessage } from 'react-intl';
import { SegmentedControl } from '@binance-chain/honeycomb';

import { useAppSelector } from '@dex-kit/hooks';

import { TabContainer } from '../styled';

export const Tabs = ({
  onTabChange,
  selectedIndex,
  tabs,
}: {
  onTabChange: Function;
  selectedIndex: number;
  tabs: Array<string>;
}) => {
  const {
    order: {
      openOrders: { order },
    },
  } = useAppSelector((state) => state);

  return (
    <TabContainer>
      <SegmentedControl variant="tab" selectedIndex={selectedIndex} role="menu" shape="fit">
        {tabs.map((el, index) => (
          <div
            key={el}
            onClick={() => onTabChange(index)}
            role="menuitem"
            tabIndex={index}
            aria-hidden="true"
          >
            <FormattedMessage id={el} /> {index === 0 && <>({order.length})</>}
          </div>
        ))}
      </SegmentedControl>
    </TabContainer>
  );
};
