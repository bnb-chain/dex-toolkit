import { useCallback, useEffect, useState, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { useTheme } from 'styled-components';
import { Icon, HoneycombThemeType } from '@binance-chain/honeycomb';

import { decimalPlaces, floor, toNonExponential } from '@dex-kit/utils/number';

import { Container, StyledTextInput, Steps, Step, Right, Hint } from './styled';

export const Input = ({
  value,
  label,
  step,
  min,
  onChange,
  right,
  placeholder,
  maxAmount,
  errorMessage,
}: {
  value: string;
  label: JSX.Element;
  step: string;
  min: string;
  onChange: Function;
  right: string | JSX.Element;
  placeholder?: string;
  maxAmount?: boolean;
  errorMessage?: string;
}) => {
  const theme = useTheme() as HoneycombThemeType;

  const [inputValue, setInputValue] = useState('');
  const [showMaxAmount, setShowMaxAmount] = useState(false);

  const firstUpdate = useRef(true);

  const calValue = useCallback(
    (val) => {
      // if (!inputValue) return '';
      let ts = decimalPlaces(Number(min));
      const [, deciam] = String(val).split('.');
      if (deciam === '') return val;
      const deciamNUm = deciam ? deciam.length : 0;
      if (deciamNUm <= ts) {
        ts = deciamNUm;
      }
      val = floor(val, ts);
      return val;
    },
    [min],
  );

  const increment = useCallback(() => {
    const newValue = inputValue
      ? calValue(parseFloat(inputValue) + parseFloat(step))
      : calValue(parseFloat(step));
    setInputValue(newValue);
    onChange(newValue);
  }, [calValue, inputValue, onChange, step]);

  const decrement = useCallback(() => {
    const newValue = inputValue
      ? calValue(parseFloat(inputValue) - parseFloat(step))
      : calValue(parseFloat(step));
    if (newValue < 0) return;
    setInputValue(newValue);
    onChange(newValue);
  }, [calValue, inputValue, onChange, step]);

  const onInputChange = useCallback(
    (e) => {
      const {
        currentTarget: { value: originalVal },
      } = e;

      const val = calValue(originalVal);
      setInputValue(val);
      onChange(val);
    },
    [calValue, onChange],
  );

  const onFocus = useCallback(() => {
    if (!maxAmount) return;
    setShowMaxAmount(true);
  }, [maxAmount]);

  const onBlur = useCallback(() => {
    if (!maxAmount) return;
    setShowMaxAmount(false);
  }, [maxAmount]);

  useEffect(() => {
    setInputValue(value);

    if (firstUpdate.current && value) {
      setInputValue(value);
      firstUpdate.current = false;
      return;
    }
  }, [value]);

  return (
    <Container>
      <StyledTextInput
        value={inputValue}
        label={label}
        onChange={onInputChange}
        onFocus={onFocus}
        onBlur={onBlur}
        min={min}
        placeholder={placeholder ? placeholder : ''}
        right={<Right>{right}</Right>}
        type="number"
        step={step}
        showMaxAmount={showMaxAmount}
        /* @ts-ignore */
        error={errorMessage && errorMessage !== ''}
        end={
          <Steps>
            <Step onClick={increment}>
              <Icon.TriangleUp
                fontSize={theme.honeycomb.size.small}
                fill={theme.honeycomb.color.text.normal}
              />
            </Step>
            <Step onClick={decrement}>
              <Icon.TriangleDown
                fontSize={theme.honeycomb.size.small}
                fill={theme.honeycomb.color.text.normal}
              />
            </Step>
          </Steps>
        }
      />
      {showMaxAmount && !errorMessage && errorMessage === '' && (
        <Hint showMaxAmount={true} error={false}>
          <FormattedMessage id="exchange.min" />
          &nbsp;
          {Number(min) < 0.000009 ? toNonExponential(Number(min)) : Number(min)}
        </Hint>
      )}
      {errorMessage && errorMessage !== '' && (
        <Hint showMaxAmount={false} error={true}>
          {errorMessage}
        </Hint>
      )}
    </Container>
  );
};
