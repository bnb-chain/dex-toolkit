// @ts-nocheck

import { useEffect, useCallback, useRef, useMemo } from 'react';
import isEqual from 'lodash-es/isEqual';

import { ChartContainer } from '../styled';
import { useAppSelector } from '@dex-kit/hooks';
import { initDepthChart } from '@dex-kit/utils/chart';
import DetectElementResize from '@dex-kit/utils/detectElementResize';

import { Container } from './styled';

const DEPTH_VIEW_NAME = 'depth';

type Props = {
  hidden: boolean;
  selectedView: string;
  fullscreen: boolean;
  interval: number;
};

type ActionType = 'buy' | 'sell';

type Order = {
  id: number;
  action: ActionType;
  amount: string | number;
  price: string | number;
  base: string;
  quote: string;
  status: string;
};

export const Depth = ({ hidden, selectedView, fullscreen, interval }: Props) => {
  const {
    orderBooks,
    exchange: { currentTrade },
    order: { openOrders },
  } = useAppSelector((state) => state);

  const depthChartContainer = useRef(null);

  const parsedAsks = useRef([]);
  const parsedBids = useRef([]);
  const lastAsks = useRef([]);
  const lastBids = useRef([]);

  const book = useMemo(() => orderBooks && orderBooks[currentTrade], [
    currentTrade,
    // eslint-disable-next-line
    JSON.stringify(orderBooks),
    orderBooks,
  ]);

  const symbol = useMemo(() => currentTrade, [currentTrade]);

  const quoteAsset = symbol.split('_')[1];

  const depth = useRef();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const resizeHandler = useCallback(() => depth.current && depth.current.resize(), [
    depth,
    fullscreen,
  ]);

  const userOrdersOnDepth = useCallback(
    (data) => {
      if (data && data instanceof Array) {
        const obj = {
          exch: 'BIJIE',
          orders: [] as Order[],
        };

        data.forEach((d) => {
          const [, quoteAsset] = d.symbol.split('_');
          if (d.symbol === symbol) {
            obj.orders.push({
              id: d.orderId,
              action: d.side === 1 ? 'buy' : 'sell',
              amount: d.quantity,
              price: d.price,
              base: d.symbol,
              quote: quoteAsset,
              status: 'Open',
            });
          }
        });
        (window as any).UserAccount.ordersAdd(obj);
      }
    },
    [symbol],
  );

  const init = useCallback(() => {
    // init depth chart if not yet done
    if (!depth.current) {
      console.log('Init depth chart.');
      depth.current = initDepthChart({
        themeName: 'depth-black-bnb',
        containerEl: depthChartContainer.current,
        symbol,
        quoteAsset,
      });
    }
  }, [quoteAsset, symbol]);

  const prevOpenOrders = useRef(openOrders).current;

  useEffect(() => {
    const element = depthChartContainer.current;
    DetectElementResize.addResizeListener(depthChartContainer.current, () => resizeHandler);
    return () => {
      resizeHandler && DetectElementResize.removeResizeListener(element, () => resizeHandler);
      try {
        depth.current && depth.current.unload();
      } catch (err) {
        console.error(err);
      }
    };
  }, [resizeHandler, depth]);

  useEffect(() => {
    if (depth.current && !isEqual(openOrders, prevOpenOrders)) {
      userOrdersOnDepth(openOrders);
    }
  }, [openOrders, userOrdersOnDepth, depth, prevOpenOrders]);

  useEffect(() => {
    if (!(window as any).UserAccount_Class && !(window as any).VisualDepth) {
      return;
    }

    if (selectedView !== DEPTH_VIEW_NAME) return;

    init();
  }, [init, selectedView]);

  useEffect(() => {
    // update the "depth" chart
    if (book && (book.asks || book.bids)) {
      let newAsks = parsedAsks.current;
      let newBids = parsedBids.current;

      if (!newAsks || lastAsks.current !== book.asks) {
        newAsks = book.asks.reduce((obj, ask) => {
          const [price, amount] = ask;
          obj[price] = amount;
          return obj;
        }, {});

        parsedAsks.current = newAsks;
      }

      if (!newBids || lastBids.current !== book.bids) {
        newBids = book.bids.reduce((obj, ask) => {
          const [price, amount] = ask;
          obj[price] = amount;
          return obj;
        }, {});

        parsedBids.current = newBids;
      }

      lastAsks.current = book.asks;
      lastBids.current = book.bids;
      (window as any).OBD.loadBook(newAsks, newBids, 100);
    } else {
      (window as any).OBD.loadBook([], [], 100);
    }
  }, [book, lastAsks, lastBids, parsedAsks, parsedBids]);

  return (
    <ChartContainer hidden={selectedView !== DEPTH_VIEW_NAME} fullscreen={fullscreen}>
      <div ref={depthChartContainer} />
      <Container className="box-inner" />
    </ChartContainer>
  );
};
