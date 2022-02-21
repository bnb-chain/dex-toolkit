import { useCallback, useState, useContext, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { crypto } from '@binance-chain/javascript-sdk';
import Big from 'big.js';

import request from '@dex-kit/utils/httpRequest';
import { isUnlockWithWalletConnect } from '@dex-kit/utils/account';
import {
  setNotLoginNotify,
  setTriggerElement,
  setLoading,
  setShowIpValidation,
} from '@dex-kit/store/global';
import { setNeedAuth } from '@dex-kit/store/account';
import { setWalletConnectURI } from '@dex-kit/store/walletConnect';
import { setPriceCheckText, setShowPriceNotify, setPriceCheck } from '@dex-kit/store/exchange';
import { useAppSelector, useAppDispatch } from '@dex-kit/hooks';
import { Context as WCClientContext } from '@dex-kit/context/WalletConnectProvider';
import { Context as BNCClientContext } from '@dex-kit/context/BNCClientProvider';

import { useDisplayAssets, useRoundValue } from '../../hooks';
import { setOpenOrder } from '@dex-kit/store';

export const usePlaceOrder = () => {
  const intl = useIntl();

  const {
    account: { privateKey, address, userInfo },
    exchange: { currentTrade, hasPriceChecked },
    globalData: { isIpValid },
    tickers: { tickerSize, lotSize },
    trade: { tradeHistory },
    order: {
      openOrders: { order },
    },
  } = useAppSelector((state) => state);

  const dispatch = useAppDispatch();

  const { roundValue } = useRoundValue();

  const client = useContext(BNCClientContext);

  const wcClient = useContext(WCClientContext);

  const { baseAsset, quoteAsset } = useDisplayAssets();

  const [errorMessage, setErrorMessage] = useState('');

  const currentTickerSize = useMemo(() => tickerSize && tickerSize[currentTrade], [
    currentTrade,
    tickerSize,
  ]);

  const currentLotSize = useMemo(() => lotSize && lotSize[currentTrade], [currentTrade, lotSize]);

  const latestTrade = useMemo(() => tradeHistory.trade[0] || {}, [tradeHistory.trade]);

  const checkQuantity = useCallback(
    (side, quantity, askTotal) => {
      const balances = userInfo.balances || [];
      let result = true;
      if (side === 1) {
        /* @ts-ignore */
        const availableBalance = balances.find((b) => b.symbol === quoteAsset);
        if (!availableBalance || availableBalance.free < parseFloat(askTotal)) {
          setErrorMessage(intl.formatMessage({ id: 'exchange.placeOrder.noEnoughBalance' }));
          result = false;
        }

        if (/.+-[a-zA-Z0-9]{3}m/i.test(baseAsset) && quantity < 1) {
          setErrorMessage(
            intl.formatMessage({ id: 'exchange.placeOrder.buy.correctAmountForbep8' }),
          );
          result = false;
        }
      }

      if (side === 2) {
        /* @ts-ignore */
        const baseAssetBalance = balances.find((b) => b.symbol === baseAsset);
        if (!baseAssetBalance || baseAssetBalance.free < parseFloat(quantity)) {
          setErrorMessage(intl.formatMessage({ id: 'exchange.placeOrder.noEnoughBalance' }));
          result = false;
        }

        if (
          /.+-[a-zA-Z0-9]{3}m/i.test(baseAsset) &&
          (quantity < 1 || (quantity < 1 && quantity !== baseAssetBalance))
        ) {
          setErrorMessage(
            intl.formatMessage({ id: 'exchange.placeOrder.sell.correctAmountForbep8' }),
          );
          result = false;
        }
      }

      return result;
    },
    [baseAsset, intl, quoteAsset, userInfo.balances],
  );

  const checkRoundSize = useCallback((roundValue, roundSize) => {
    try {
      roundSize = new Big(roundSize);
      roundValue = new Big(roundValue);
      const roundResult = +roundValue.mod(roundSize).toString();
      return !(roundResult > 0);
    } catch (err) {
      return true;
    }
  }, []);

  const placeOrder = async (
    side: number,
    price: string,
    quantity: string,
    currentTarget: HTMLInputElement,
    askTotal?: string,
  ) => {
    setErrorMessage('');

    if (!isIpValid) {
      dispatch(setShowIpValidation(true));
      return {
        status: 'warning',
        extraMessage: null,
      } as const;
    }

    const latestPrice = latestTrade.p || latestTrade.price;

    if (!address) {
      dispatch(setNotLoginNotify(true));
      return {
        status: 'warning',
        extraMessage: null,
      } as const;
    }

    if (!checkQuantity(side, quantity, askTotal)) {
      return {
        status: 'warning',
        extraMessage: errorMessage,
      } as const;
    }

    if (!checkRoundSize(price, currentTickerSize)) {
      setErrorMessage(`price should be integer multiples of ${parseFloat(currentLotSize)}`);
      return {
        status: 'warning',
        extraMessage: errorMessage,
      } as const;
    }

    if (!checkRoundSize(quantity, currentLotSize)) {
      setErrorMessage(
        `You can only buy / sell ${baseAsset} in multiples of ${parseFloat(currentLotSize)}`,
      );
      return {
        status: 'warning',
        extraMessage: errorMessage,
      } as const;
    }

    if (!price || Number(price) < 0) {
      setErrorMessage(intl.formatMessage({ id: 'exchange.placeOrder.pleaseInputCorrectPrice' }));
      return {
        status: 'warning',
        extraMessage: errorMessage,
      } as const;
    }

    if (!quantity || Number(quantity) < 0) {
      setErrorMessage(intl.formatMessage({ id: 'exchange.placeOrder.pleaseInputCorrectAmount' }));
      return {
        status: 'warning',
        extraMessage: errorMessage,
      } as const;
    }

    /* @ts-ignore */
    if (isUnlockWithWalletConnect() && !wcClient.connected()) {
      /* @ts-ignore */
      const uri = await wcClient.startSession(false);
      console.log('WalletConnect URI', uri);
      dispatch(setWalletConnectURI(uri));
      dispatch(setTriggerElement(currentTarget));
      return {
        status: 'warning',
        extraMessage: null,
      } as const;
    }

    if (!privateKey) {
      dispatch(setTriggerElement(currentTarget));
      dispatch(setNeedAuth(true));
      return {
        status: 'warning',
        extraMessage: null,
      } as const;
    }

    if (Number(price) >= latestPrice * 1.02 && !hasPriceChecked && side === 1) {
      dispatch(setTriggerElement(currentTarget));
      dispatch(
        setPriceCheckText(intl.formatMessage({ id: 'exchange.placeOrder.orderPriceHigher' })),
      );
      dispatch(setShowPriceNotify(true));
      dispatch(setPriceCheck(true));
      return {
        status: 'warning',
        extraMessage: null,
      } as const;
    }

    if (Number(price) <= latestPrice * 0.98 && !hasPriceChecked && side === 2) {
      dispatch(setTriggerElement(currentTarget));
      dispatch(setPriceCheckText(intl.formatMessage({ id: 'exchange.placeOrder.orderPriceLow' })));
      dispatch(setShowPriceNotify(true));
      dispatch(setPriceCheck(true));
      return {
        status: 'warning',
        extraMessage: null,
      } as const;
    }

    const account = (await request.getAccount(address)) || {};

    /* @ts-ignore */
    privateKey !== 'HARDWARE' && (await client.setPrivateKey(privateKey));

    const accCode = crypto.decodeAddress(address);
    const sequence = parseInt(account.sequence, 10);

    const placeOrderMessage = {
      sender: accCode,
      id: `${accCode.toString('hex')}-${sequence + 1}`.toUpperCase(),
      symbol: `${baseAsset}_${quoteAsset}`,
      ordertype: 2,
      side,
      price: roundValue(price, currentTickerSize),
      quantity: roundValue(quantity, currentLotSize),
      timeinforce: 1,
      msgType: 'NewOrderMsg',
    };

    try {
      privateKey !== 'HARDWARE' && dispatch(setLoading(true));
      /* @ts-ignore */
      const res = await client.placeOrder(
        address,
        `${baseAsset}_${quoteAsset}`,
        side,
        price,
        quantity,
        sequence,
      );
      dispatch(setLoading(false));

      if (res.status === 200) {
        const newOrders = [...order];
        newOrders.unshift({
          transactionHash: res.result[0].hash,
          orderCreateTime: new Date(),
          symbol: placeOrderMessage.symbol,
          side: placeOrderMessage.side,
          price: placeOrderMessage.price,
          quantity: placeOrderMessage.quantity,
          cumulateQuantity: 0,
          total: placeOrderMessage.price * placeOrderMessage.quantity,
          op: '',
          orderId: placeOrderMessage.id,
        });

        dispatch(setPriceCheck(false));
        /* @ts-ignore */
        dispatch(setOpenOrder({ order: newOrders }));

        return {
          status: 'success',
          extraMessage: null,
        } as const;
      } else {
        dispatch(setPriceCheck(false));
        dispatch(setLoading(false));

        return {
          status: 'failed',
          extraMessage: res.message || errorMessage,
        } as const;
      }
    } catch (err) {
      dispatch(setPriceCheck(false));
      dispatch(setLoading(false));

      return {
        status: 'failed',
        extraMessage: err.message,
      } as const;
    }
  };

  return {
    placeOrder,
    errorMessage,
  };
};
