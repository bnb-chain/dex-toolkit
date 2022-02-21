import { useCallback } from 'react';
import { decimalPlaces, floor } from '@dex-kit/utils/number';

export const useRoundValue = () => {
  const roundValue = useCallback((value, precision?) => {
    precision = precision || '0.00000001';
    const ts = decimalPlaces(precision);
    value = parseFloat(floor(value, ts));
    return value;
  }, []);

  return {
    roundValue,
  };
};
