import { useIntl } from 'react-intl';
import { Icon } from '@binance-chain/honeycomb';

import { Container, StyledTextInput } from './styled';

export const Search = ({ onSearchChange, query }: { onSearchChange: Function; query: string }) => {
  const intl = useIntl();
  return (
    <Container>
      <StyledTextInput
        value={query}
        placeholder={intl.formatMessage({ id: 'exchange.tradingPair.search' })}
        left={<Icon.Search />}
        onChange={(evt) => onSearchChange(evt)}
        size="increased"
      />
    </Container>
  );
};
