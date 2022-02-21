import { FormattedMessage } from 'react-intl';

import { Side as SideType } from '../types';
import { Positive, Negative } from '../styled';

export const Side = ({ side }: { side: SideType; children: any }) => {
  if (side.toLowerCase() === 'buy') {
    return (
      <Positive>
        <FormattedMessage id="exchange.buy" />
      </Positive>
    );
  }

  if (side.toLowerCase() === 'sell') {
    return (
      <Negative>
        <FormattedMessage id="exchange.sell" />
      </Negative>
    );
  }

  return null;
};
