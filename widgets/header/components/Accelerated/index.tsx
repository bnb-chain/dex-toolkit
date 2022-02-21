import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Space } from '@binance-chain/honeycomb';
import httpRequest, { NETWORKS, savedNetwork } from '@dex-kit/utils/httpRequest';
import dateFormatter from '@dex-kit/utils/dateFormatter';

import {
  Circle,
  DateTime,
  Latency,
  Container,
  Inner,
  InnerText,
  InnerBlock,
  Selected,
  SelectedInner,
} from './styled';

export const Accelerated = () => {
  const { locale } = useIntl();
  const [datetime, setDatetime] = useState('');
  const [apiLatency, setApiLatency] = useState<{ [key: string]: string | number }>({});
  const [current, setCurrent] = useState(savedNetwork);

  const ping = useCallback(() => {
    let pingTime: number | string = 200000;
    let node = NETWORKS[0];

    NETWORKS.forEach(async (network: string, index: number) => {
      const startTime = new Date().getTime();
      let endTime;
      let diff: number | string = 0;

      try {
        await httpRequest.ping(`https://${network}`);
        endTime = new Date().getTime();
        diff = endTime - startTime;
      } catch (err) {
        diff = 'error';
      }

      apiLatency[network] = diff;
      setApiLatency(apiLatency);

      if (diff < pingTime) {
        pingTime = diff;
        node = savedNetwork || network;
      }

      if (index === NETWORKS.length - 1) {
        httpRequest.setBaseUri(node);
        setCurrent(node);
      }
    });
  }, [apiLatency]);

  const switchNetwork = useCallback((network: string) => {
    setCurrent(network);
    window.sessionStorage.setItem('network', network);
  }, []);

  const getLatencyStatus = useCallback(
    (network: string) => {
      const traffic = apiLatency[network];
      let status = 'success';

      if (traffic > 1000 && traffic < 2000) {
        status = 'warning';
      }

      if (traffic >= 2000 || traffic === 'error') {
        status = 'danger';
      }

      return status;
    },
    [apiLatency],
  );

  const getOptions = useCallback(
    () =>
      NETWORKS.map((network: string, index: number) => {
        const traffic = apiLatency[network];
        const status = getLatencyStatus(network);

        return {
          element: (
            <Container key={`accelerated-${index}`} onClick={() => switchNetwork(network)}>
              <Inner>
                <InnerBlock>
                  <Latency {...(current === network && { status })}>
                    <Circle {...(current === network && { status })} />
                    <Space size="tiny" />
                    <>{`Accelerated ${index + 1}`}</>
                  </Latency>
                  <Latency {...(current === network && { status })}>
                    <span>{traffic === 'error' ? 'Network Issue' : `${traffic || 0} ms`}</span>
                  </Latency>
                </InnerBlock>
                <InnerBlock>
                  <InnerText>{network}</InnerText>
                </InnerBlock>
              </Inner>
            </Container>
          ),
          className: 'accelerated-button',
        };
      }),
    [apiLatency, current, getLatencyStatus, switchNetwork],
  );

  const currentAccelerated = useCallback(() => {
    if (!current) return;
    return NETWORKS.indexOf(current) + 1;
  }, [current]);

  const renderAccelerated = useCallback(() => {
    if (!current) return null;
    const status = getLatencyStatus(current);
    return (
      <Latency status={status}>
        <Circle status={status} />
        <Space size="micro" />
        {`Accelerated ${currentAccelerated()}`}
      </Latency>
    );
  }, [current, currentAccelerated, getLatencyStatus]);

  useEffect(() => {
    setTimeout(() => {
      setDatetime(dateFormatter(new Date()));
    }, 1000);
  }, [datetime, locale]);

  useEffect(() => {
    ping();
  }, [ping]);

  return {
    selected: (
      <Selected>
        <SelectedInner>
          <DateTime>{datetime}</DateTime>
        </SelectedInner>
        <Space size="tiny" />
        <SelectedInner>{renderAccelerated()}</SelectedInner>
      </Selected>
    ),
    options: getOptions(),
  };
};
