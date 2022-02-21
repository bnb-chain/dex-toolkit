import { useTheme } from 'styled-components';
import { SegmentedControl, HoneycombThemeType } from '@binance-chain/honeycomb';
import { Icon } from '@dex-kit/utils/icons';

import { TabInner } from './styled';

export const Tabs = ({
  onTabChange,
  selectedTab,
  tabs,
}: {
  onTabChange: Function;
  selectedTab: string;
  tabs: Array<string>;
}) => {
  const theme = useTheme() as HoneycombThemeType;
  return (
    <SegmentedControl
      variant="tab"
      selectedIndex={tabs.indexOf(selectedTab)}
      role="menu"
      onChange={({ selectedIndex }) => onTabChange(tabs[selectedIndex])}
    >
      {tabs.map((el, index) => (
        <TabInner
          key={el}
          role="menuitem"
          tabIndex={index}
          aria-hidden="true"
          selected={tabs.indexOf(selectedTab) === index}
        >
          {el === 'favorites' ? (
            <Icon.Star
              fill={
                tabs.indexOf(selectedTab) === 0
                  ? theme.honeycomb.color.primary.normal
                  : theme.honeycomb.color.text.masked
              }
            />
          ) : (
            el
          )}
        </TabInner>
      ))}
    </SegmentedControl>
  );
};
