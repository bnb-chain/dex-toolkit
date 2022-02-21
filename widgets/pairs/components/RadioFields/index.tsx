import { useIntl } from 'react-intl';
import { Radio } from '@binance-chain/honeycomb';

import { Container, RadioContainer } from './styled';

export const RadioFields = ({
  onRadioChange,
  checkedValue,
}: {
  onRadioChange: Function;
  checkedValue: string;
}) => {
  const intl = useIntl();
  return (
    <Container>
      <RadioContainer>
        <Radio
          value="change"
          label={intl.formatMessage({ id: 'exchange.tradingPair.change' })}
          name="change"
          onChange={(evt) => onRadioChange(evt)}
          checked={checkedValue === 'change'}
        />
      </RadioContainer>
      <RadioContainer>
        <Radio
          value="volume"
          label={intl.formatMessage({ id: 'exchange.tradingPair.volume' })}
          name="volume"
          onChange={(evt) => onRadioChange(evt)}
          checked={checkedValue === 'volume'}
        />
      </RadioContainer>
    </Container>
  );
};
