import { useState, useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { Dropdown, Space } from '@binance-chain/honeycomb';

import { Container, StyledDropdownDefaultTarget } from './styled';

export const TypeFilter = ({ onFilterChange }: { onFilterChange: Function }) => {
  const data = useMemo(
    () => [
      {
        key: 'both',
        value: 0,
        text: (
          <>
            <FormattedMessage id="exchange.buy" /> & <FormattedMessage id="exchange.sell" />
          </>
        ),
      },
      {
        key: 'buy',
        value: 1,
        text: <FormattedMessage id="exchange.buy" />,
      },
      {
        key: 'sell',
        value: 2,
        text: <FormattedMessage id="exchange.sell" />,
      },
    ],
    [],
  );

  const [selected, setSelected] = useState(data[0]);

  const onChange = useCallback(
    ({ selected: passed }) => {
      setSelected(passed);

      onFilterChange({ side: passed.value });
    },
    [onFilterChange],
  );

  return (
    <Container>
      <FormattedMessage id="exchange.type" />
      :
      <Space size="tiny" />
      <Dropdown target={<StyledDropdownDefaultTarget>{selected.text}</StyledDropdownDefaultTarget>}>
        {data.map((el) => (
          <Dropdown.Item
            key={el.key}
            onClick={() => onChange({ selected: el })}
            selected={selected.value === el.value}
          >
            {el.text}
          </Dropdown.Item>
        ))}
      </Dropdown>
      <Space size="normal" />
    </Container>
  );
};
