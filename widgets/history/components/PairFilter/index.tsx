import { useState, useCallback, useRef, useMemo, useLayoutEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { Dropdown, Select, Space } from '@binance-chain/honeycomb';

import { useAppSelector } from '@dex-kit/hooks';

import { Container, StyledDropdownDefaultTarget, StyledSelectDefaultTarget } from './styled';

export const PairFilter = ({ onFilterChange }: { onFilterChange: Function }) => {
  const {
    exchange: { tokens },
    tradePairs: { pairs },
  } = useAppSelector((state) => state);

  const firstUpdate = useRef(true);

  const [selectedQuoteSymbol, setSelectedQuoteSymbol] = useState({
    value: '',
    text: '',
  });

  const [selectedBaseSymbol, setSelectedBaseSymbol] = useState({
    symbol: '',
  });

  const [open, setOpen] = useState(false);

  const symbols = useMemo(() => {
    /* @ts-ignore */
    const result = [];
    /* @ts-ignore */
    pairs.forEach((pair) => {
      /* @ts-ignore */
      const quoteSymbol = result.find((symbol) => symbol === pair.quote_asset_symbol);
      if (!quoteSymbol) {
        result.push(pair.quote_asset_symbol);
      }
    });

    /* @ts-ignore */
    return result.map((symbol) => ({
      value: symbol,
      text: symbol.replace(/-.*$/i, ''),
    }));
  }, [pairs]);

  const onChange = useCallback(
    (opts) => {
      const { baseAsset, quoteAsset } = opts;
      if (baseAsset) {
        setSelectedBaseSymbol(baseAsset);
        onFilterChange({ symbol: `${baseAsset.symbol}_${selectedQuoteSymbol.value}` });
      }
      if (quoteAsset) {
        setSelectedQuoteSymbol(quoteAsset);
        if (selectedBaseSymbol.symbol === '') return;
        onFilterChange({ symbol: `${selectedBaseSymbol.symbol}_${quoteAsset.value}` });
      }
    },
    [onFilterChange, selectedBaseSymbol, selectedQuoteSymbol.value],
  );

  useLayoutEffect(() => {
    if (firstUpdate.current) {
      setSelectedQuoteSymbol(symbols[0]);
      firstUpdate.current = false;
      return;
    }
  }, [setSelectedQuoteSymbol, symbols]);

  return (
    <Container>
      <FormattedMessage id="exchange.pair" />
      :
      <Space size="tiny" />
      <Select
        open={open}
        onClose={() => setOpen(false)}
        target={
          <StyledSelectDefaultTarget onClick={() => setOpen((value) => !value)}>
            {selectedBaseSymbol.symbol === '' ? (
              <FormattedMessage id="exchange.coin" />
            ) : (
              selectedBaseSymbol.symbol
            )}
          </StyledSelectDefaultTarget>
        }
      >
        {
          /* @ts-ignore */
          tokens.map((el, index) => (
            <Select.Option
              key={index}
              searchAs={el.symbol}
              onClick={() => onChange({ baseAsset: el })}
            >
              {el.symbol}
            </Select.Option>
          ))
        }
      </Select>
      <Space size="tiny" />
      /
      <Space size="tiny" />
      <Dropdown
        target={
          <StyledDropdownDefaultTarget>{selectedQuoteSymbol.text}</StyledDropdownDefaultTarget>
        }
      >
        {symbols.map((el, index) => (
          <Dropdown.Item
            key={el.value}
            onClick={() => onChange({ quoteAsset: el })}
            selected={selectedQuoteSymbol.value === el.value}
          >
            {el.text}
          </Dropdown.Item>
        ))}
      </Dropdown>
    </Container>
  );
};
