import { useMemo, useEffect, useRef, useCallback, useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';
import { Button, Space, Toast, createToast } from '@binance-chain/honeycomb';

import { useAppSelector, useAppDispatch, useWindowSize } from '@dex-kit/hooks';
import { decimalPlaces, floor, toNonExponential } from '@dex-kit/utils/number';
import { getTokenType } from '@dex-kit/utils/tokenTypes';
import { getTradeHistoryQS } from '@dex-kit/store/trade';

import {
  useDisplayAssets,
  useRoundValue,
  useAssetBalance,
  usePlaceOrder,
  useBestValues,
} from '../../hooks';

import { Input } from '../Input';
import { Warning } from '../Warning';

import {
  FormContainer,
  ToastContainer,
  ToastTitle,
  ToastDescription,
  LabelContainer,
  SetterContainer,
  Setter,
  Asset,
} from '../styled';

export const Ask = () => {
  const intl = useIntl();

  const {
    account: { address },
    exchange: { currentTrade, currentPrice, buyAmount: propBuyAmount },
    tickers: { tickerSize, lotSize },
    trade: { tradeHistory },
  } = useAppSelector((state) => state);

  const dispatch = useAppDispatch();

  const { isMd } = useWindowSize();

  const { symbol } = useParams<{ symbol: string }>();

  const [askValue, setAskValue] = useState('');
  const [askTotal, setAskTotal] = useState('');
  const [buyAmount, setBuyAmount] = useState('');
  const [maxBuyAmount, setMaxBuyAmount] = useState('--');
  const [warningOpen, setWarningOpen] = useState(false);

  const { baseAsset, quoteAsset, displayBaseAsset, displayQuoteAsset } = useDisplayAssets();

  const { roundValue } = useRoundValue();

  const { getBalance } = useAssetBalance();

  const { getBestValue } = useBestValues();

  const { placeOrder, errorMessage } = usePlaceOrder();

  const [internalErrorMessage, setInternalErrorMessage] = useState('');

  const currentTickerSize = useMemo(() => tickerSize && tickerSize[currentTrade], [
    currentTrade,
    tickerSize,
  ]);

  const currentLotSize = useMemo(() => lotSize && lotSize[currentTrade], [currentTrade, lotSize]);

  const latestTrade = useMemo(() => tradeHistory.trade[0] || {}, [tradeHistory.trade]);

  const latestPrice = useMemo(
    () =>
      currentPrice ||
      parseFloat(
        floor(latestTrade.p || latestTrade.price, decimalPlaces(Number(currentTickerSize))),
      ),
    [currentPrice, currentTickerSize, latestTrade.p, latestTrade.price],
  );

  const askPrice = useMemo(() => {
    const price = askValue || roundValue(latestTrade.price, currentTickerSize);
    if (price < 0.000009) return toNonExponential(price);
    return price;
  }, [askValue, currentTickerSize, latestTrade.price, roundValue]);

  const askValueChange = useCallback(
    (askValue) => {
      const quoteAssetBalance = getBalance(quoteAsset);
      let maxBuyAmount =
        askValue &&
        roundValue(parseFloat(quoteAssetBalance) / parseFloat(askValue), currentLotSize);

      maxBuyAmount = maxBuyAmount || '0.0';
      askValue = askValue === '' || askValue === 0 ? 'void' : askValue;
      setInternalErrorMessage('');

      if (buyAmount) {
        setAskValue(askValue);
        setMaxBuyAmount(maxBuyAmount);
        setAskTotal(askValue ? roundValue(parseFloat(askValue) * parseFloat(buyAmount)) : '');
      } else {
        setAskValue(askValue);
        setMaxBuyAmount(maxBuyAmount);
      }
    },
    [buyAmount, getBalance, currentLotSize, quoteAsset, roundValue],
  );

  const buyAmountChange = useCallback(
    (passedAmount) => {
      const quoteAssetBalance = getBalance(quoteAsset);
      const maxBuyAmount =
        roundValue(parseFloat(quoteAssetBalance) / parseFloat(askValue), currentLotSize) || '0.0';
      setInternalErrorMessage('');

      if (askValue) {
        setBuyAmount(passedAmount);
        setMaxBuyAmount(maxBuyAmount);
        setAskTotal(
          passedAmount ? roundValue(parseFloat(askValue) * parseFloat(passedAmount)) : '',
        );
        setInternalErrorMessage('');
      } else {
        setBuyAmount(passedAmount);
      }
    },
    [askValue, currentLotSize, getBalance, quoteAsset, roundValue],
  );

  const askTotalChange = useCallback(
    (askTotal) => {
      setInternalErrorMessage('');

      if (!askValue && !buyAmount) {
        setAskTotal(askTotal);
      } else {
        const newBuyAmount = askTotal
          ? roundValue(parseFloat(askTotal) / parseFloat(askValue), currentLotSize)
          : '';
        setAskTotal(askTotal);
        setBuyAmount(newBuyAmount);
      }
    },
    [askValue, buyAmount, currentLotSize, roundValue],
  );

  const onBuyClick = useCallback(
    async (ev) => {
      if (!address || address === '') {
        setWarningOpen(true);
        return;
      }

      const { status, extraMessage } = await placeOrder(
        1,
        askValue,
        buyAmount,
        ev.currentTarget,
        askTotal,
      );

      if (status === 'success') {
        setInternalErrorMessage('');

        createToast(
          <Toast icon={<Toast.Icon.Success />}>
            <ToastContainer>
              <ToastTitle>
                <FormattedMessage
                  id="exchange.placeOrder.successNotifyTitle"
                  values={{
                    side: 'Buy',
                  }}
                />
              </ToastTitle>
              <ToastDescription>
                <FormattedMessage
                  id="exchange.placeOrder.successNotifyMsg"
                  values={{
                    side: 'Buy',
                    quantity: buyAmount,
                    quoteAsset: baseAsset,
                  }}
                />
              </ToastDescription>
            </ToastContainer>
          </Toast>,
        );
      } else {
        setInternalErrorMessage(
          extraMessage || errorMessage || intl.formatMessage({ id: 'common.errorOccured' }),
        );
        createToast(
          <Toast icon={<Toast.Icon.Danger />}>
            <ToastContainer>
              <ToastTitle>
                <FormattedMessage id="exchange.placeOrder.orderError" />
              </ToastTitle>
              <ToastDescription>
                {extraMessage || <FormattedMessage id="common.errorOccured" />}
              </ToastDescription>
            </ToastContainer>
          </Toast>,
        );
      }
    },
    [address, askTotal, askValue, baseAsset, buyAmount, errorMessage, intl, placeOrder],
  );

  const onBestValueClick = useCallback(() => {
    const { value, amount, total } = getBestValue({
      type: 'asks',
      value: askValue,
      amount: buyAmount,
      total: askTotal,
    });
    setAskValue(value);
    setBuyAmount(amount);
    setAskTotal(total);
  }, [askTotal, askValue, buyAmount, getBestValue]);

  const calPercentage = useCallback(
    (percentage) => () => {
      if (!askValue) return;
      const quoteAssetBalance = getBalance(quoteAsset);
      setBuyAmount(roundValue((quoteAssetBalance * percentage) / Number(askValue), currentLotSize));
      setAskTotal(roundValue(quoteAssetBalance * percentage));
    },
    [askValue, currentLotSize, getBalance, quoteAsset, roundValue],
  );

  const updateTradeHistory = useCallback(() => {
    const tokenType = getTokenType();
    if (!currentTrade) return;
    const tradeParams = {
      offset: 0,
      limit: 50,
      symbol: symbol || currentTrade,
      end: new Date().getTime(),
    };
    dispatch(getTradeHistoryQS({ params: tradeParams, tokenType }));
  }, [currentTrade, dispatch, symbol]);

  const prevTrade = useRef(currentTrade).current;

  useEffect(() => {
    if ((prevTrade === currentTrade && tradeHistory.trade.length > 0) || !isMd) return;
    updateTradeHistory();
  }, [currentTrade, isMd, prevTrade, symbol, tradeHistory.trade.length, updateTradeHistory]);

  useEffect(() => {
    const quoteAssetBalance = getBalance(quoteAsset);

    if (!askValue) {
      setAskValue(askValue === 'void' ? '' : latestPrice);
    }

    setMaxBuyAmount(
      roundValue(
        parseFloat(quoteAssetBalance) / parseFloat(askValue || latestPrice) || '0.0',
        currentLotSize,
      ),
    );
  }, [askValue, currentLotSize, getBalance, latestPrice, quoteAsset, roundValue]);

  useEffect(() => {
    setAskValue(latestPrice);
  }, [latestPrice]);

  useEffect(() => {
    const roundBuyAmount = roundValue(propBuyAmount, currentLotSize);
    const quoteAssetBalance = getBalance(quoteAsset);
    let askTotal = propBuyAmount
      ? roundValue(parseFloat(latestPrice) * parseFloat(roundBuyAmount), currentTickerSize)
      : '';

    askTotal =
      Number(askTotal) >= parseFloat(quoteAssetBalance)
        ? roundValue(parseFloat(quoteAssetBalance))
        : askTotal;
    setBuyAmount(propBuyAmount === '' ? '' : roundBuyAmount);
    setAskTotal(askTotal);
  }, [
    currentLotSize,
    currentTickerSize,
    getBalance,
    latestPrice,
    propBuyAmount,
    quoteAsset,
    roundValue,
  ]);

  return (
    <FormContainer>
      <Input
        value={askPrice}
        label={
          <LabelContainer>
            <FormattedMessage id="exchange.price" />
            <Setter onClick={onBestValueClick}>
              <FormattedMessage id="exchange.placeOrder.bestAsk" />
            </Setter>
          </LabelContainer>
        }
        step={currentTickerSize}
        min={currentTickerSize}
        onChange={askValueChange}
        right={<Asset>{displayQuoteAsset}</Asset>}
      />
      <Space size="small" />
      <Input
        value={buyAmount}
        label={
          <LabelContainer>
            <FormattedMessage id="exchange.amount" />
            <SetterContainer>
              <Setter onClick={calPercentage(0.25)}>25%</Setter>
              <Space size="tiny" />
              <Setter onClick={calPercentage(0.5)}>50%</Setter>
              <Space size="tiny" />
              <Setter onClick={calPercentage(0.75)}>75%</Setter>
              <Space size="tiny" />
              <Setter onClick={calPercentage(1)}>100%</Setter>
            </SetterContainer>
          </LabelContainer>
        }
        step={currentLotSize}
        min={currentLotSize}
        onChange={buyAmountChange}
        placeholder={`${intl.formatMessage({ id: 'exchange.max' })}: ${maxBuyAmount}`}
        right={<Asset>{displayBaseAsset}</Asset>}
        maxAmount={true}
        errorMessage={internalErrorMessage}
      />
      <Space size="small" />
      <Input
        value={askTotal}
        label={
          <LabelContainer>
            <FormattedMessage id="exchange.total" />
            <SetterContainer>
              {displayQuoteAsset ? `${getBalance(quoteAsset)} ${displayQuoteAsset}` : '--'}
            </SetterContainer>
          </LabelContainer>
        }
        step={currentTickerSize}
        min={currentTickerSize}
        onChange={askTotalChange}
        right={<Asset>{displayQuoteAsset}</Asset>}
      />
      <Space size="small" />
      <Button variant="buy" onClick={onBuyClick}>
        <FormattedMessage id="exchange.buy" />
        <Space size="tiny" />
        {displayBaseAsset}
      </Button>
      <Warning open={warningOpen} onClose={() => setWarningOpen(false)} />
    </FormContainer>
  );
};
