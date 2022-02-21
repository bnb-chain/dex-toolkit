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

export const Bid = () => {
  const intl = useIntl();

  const {
    account: { address },
    exchange: { currentTrade, currentPrice, sellAmount: propSellAmount },
    tickers: { tickerSize, lotSize },
    trade: { tradeHistory },
  } = useAppSelector((state) => state);

  const [bidValue, setBidValue] = useState('');
  const [bidTotal, setBidTotal] = useState('');
  const [sellAmount, setSellAmount] = useState('');
  const [maxSellAmount, setMaxSellAmount] = useState('--');
  const [warningOpen, setWarningOpen] = useState(false);

  const dispatch = useAppDispatch();

  const { isMd } = useWindowSize();

  const { symbol } = useParams<{ symbol: string }>();

  const { baseAsset, displayBaseAsset, displayQuoteAsset } = useDisplayAssets();

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

  const bidPrice = useMemo(() => {
    const price = bidValue || roundValue(latestTrade.price, currentTickerSize);
    if (price < 0.000009) return toNonExponential(price);
    return price;
  }, [bidValue, currentTickerSize, latestTrade.price, roundValue]);

  const bidValueChange = useCallback(
    (bidValue) => {
      const baseAssetBalance = getBalance(baseAsset);
      bidValue = bidValue === '' || bidValue === 0 ? 'void' : bidValue;
      setInternalErrorMessage('');

      if (sellAmount) {
        setBidValue(bidValue);
        setMaxSellAmount(parseFloat(baseAssetBalance) ? `${parseFloat(baseAssetBalance)}` : '0.0');
        setBidTotal(bidValue ? roundValue(parseFloat(bidValue) * parseFloat(sellAmount)) : '');
      } else {
        setBidValue(bidValue);
      }
    },
    [baseAsset, getBalance, roundValue, sellAmount],
  );

  const sellAmountChange = useCallback(
    (sellA) => {
      setInternalErrorMessage('');

      if (bidValue) {
        const baseAssetBalance = getBalance(baseAsset);
        setSellAmount(sellA);
        setMaxSellAmount(parseFloat(baseAssetBalance) ? `${parseFloat(baseAssetBalance)}` : '0.0');
        setBidTotal(sellA ? String(roundValue(parseFloat(bidValue) * parseFloat(sellA))) : '');
      } else {
        setSellAmount(sellA);
      }
    },
    [baseAsset, bidValue, getBalance, roundValue, setInternalErrorMessage],
  );

  const bidTotalChange = useCallback(
    (bidTotal) => {
      setInternalErrorMessage('');

      if (!bidValue && !sellAmount) {
        setBidTotal(bidTotal);
      } else {
        setBidTotal(bidTotal);
        setSellAmount(
          bidTotal ? roundValue(parseFloat(bidTotal) / parseFloat(bidValue), currentLotSize) : '',
        );
      }
    },
    [bidValue, currentLotSize, roundValue, sellAmount],
  );

  const onSellClick = useCallback(
    async (ev) => {
      if (!address || address === '') {
        setWarningOpen(true);
        return;
      }

      const { status, extraMessage } = await placeOrder(2, bidValue, sellAmount, ev.currentTarget);

      if (status === 'success') {
        setInternalErrorMessage('');

        createToast(
          <Toast icon={<Toast.Icon.Success />}>
            <ToastContainer>
              <ToastTitle>
                <FormattedMessage
                  id="exchange.placeOrder.successNotifyTitle"
                  values={{
                    side: 'Sell',
                  }}
                />
              </ToastTitle>
              <ToastDescription>
                <FormattedMessage
                  id="exchange.placeOrder.successNotifyMsg"
                  values={{
                    side: 'Sell',
                    quantity: sellAmount,
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
    [address, baseAsset, bidValue, errorMessage, intl, placeOrder, sellAmount],
  );

  const onBestValueClick = useCallback(() => {
    const { value, amount, total } = getBestValue({
      type: 'bids',
      value: bidValue,
      amount: sellAmount,
      total: bidTotal,
    });
    setBidValue(value);
    setSellAmount(amount);
    setBidTotal(total);
  }, [bidTotal, bidValue, sellAmount, getBestValue]);

  const calPercentage = useCallback(
    (percentage) => () => {
      if (!bidValue) return;
      const baseAssetBalance = getBalance(baseAsset);
      const sellAmount = roundValue(baseAssetBalance * percentage, currentLotSize);
      setSellAmount(sellAmount);
      setBidTotal(roundValue(sellAmount * Number(bidValue)));
    },
    [baseAsset, bidValue, getBalance, currentLotSize, roundValue],
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
    const baseAssetBalance = getBalance(baseAsset);

    if (!bidValue) {
      setBidValue(bidValue === 'void' ? '' : latestPrice);
    }

    setMaxSellAmount(
      roundValue(
        parseFloat(baseAssetBalance) ? parseFloat(baseAssetBalance) : '0.0',
        currentLotSize,
      ),
    );
  }, [baseAsset, bidValue, currentLotSize, getBalance, latestPrice, roundValue]);

  useEffect(() => {
    setBidValue(latestPrice);
  }, [latestPrice]);

  useEffect(() => {
    const roundSellAmount = roundValue(propSellAmount, currentLotSize);
    setSellAmount(propSellAmount === '' ? '' : roundSellAmount);
    setBidTotal(
      latestPrice && propSellAmount !== ''
        ? roundValue(parseFloat(latestPrice) * parseFloat(roundSellAmount))
        : '',
    );
  }, [currentLotSize, latestPrice, propSellAmount, roundValue]);

  return (
    <FormContainer>
      <Input
        value={bidPrice}
        label={
          <LabelContainer>
            <FormattedMessage id="exchange.price" />
            <Setter onClick={onBestValueClick}>
              <FormattedMessage id="exchange.placeOrder.bestBid" />
            </Setter>
          </LabelContainer>
        }
        step={currentTickerSize}
        min={currentTickerSize}
        onChange={bidValueChange}
        right={<Asset>{displayQuoteAsset}</Asset>}
      />
      <Space size="small" />
      <Input
        value={sellAmount}
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
        onChange={sellAmountChange}
        placeholder={`${intl.formatMessage({ id: 'exchange.max' })}: ${maxSellAmount}`}
        right={<Asset>{displayBaseAsset}</Asset>}
        maxAmount={true}
        errorMessage={internalErrorMessage}
      />
      <Space size="small" />
      <Input
        value={bidTotal}
        label={
          <LabelContainer>
            <FormattedMessage id="exchange.total" />
            <SetterContainer>
              {displayBaseAsset ? `${getBalance(baseAsset)} ${displayBaseAsset}` : '--'}
            </SetterContainer>
          </LabelContainer>
        }
        step={currentTickerSize}
        min={currentTickerSize}
        onChange={bidTotalChange}
        right={<Asset>{displayQuoteAsset}</Asset>}
      />
      <Space size="small" />
      <Button variant="sell" onClick={onSellClick}>
        <FormattedMessage id="exchange.sell" />
        <Space size="tiny" />
        {displayBaseAsset}
      </Button>
      <Warning open={warningOpen} onClose={() => setWarningOpen(false)} />
    </FormContainer>
  );
};
