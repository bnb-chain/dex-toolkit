import { useState, useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { BuyWithMoonPay, Modal, SegmentedControl, Button, Space } from '@binance-chain/honeycomb';

import { useAppSelector, useWindowSize } from '@dex-kit/hooks';
import { getDomain } from '@dex-kit/utils/httpRequest';

import { Ask } from './Ask';
import { Bid } from './Bid';
import { Warning } from './Warning';

import { Container, Title, MoonPayContainer, Forms, GlobalStyles, CTAContainer } from './styled';

import type { MoonpayMode } from './types';

const { REACT_APP_MOON_PAY_MODE = 'test' as MoonpayMode, REACT_APP_MOON_PAY_API_KEY } = process.env;

export const Main = () => {
  const {
    account: { address },
  } = useAppSelector((state) => state);

  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const [open, setOpen] = useState<boolean>(false);
  const [warningOpen, setWarningOpen] = useState(false);

  const { isSm } = useWindowSize();

  const modalHandler = useCallback(
    (index: number) => () => {
      if (!address || address === '') {
        setWarningOpen(true);
        return;
      }
      setOpen(true);
      setSelectedIndex(index);
    },
    [address],
  );

  return (
    <>
      {isSm ? (
        <>
          <>
            <CTAContainer>
              <Button variant="buy" onClick={modalHandler(0)}>
                <FormattedMessage id="exchange.buy" />
              </Button>
            </CTAContainer>
            <Space size="tiny" />
            <CTAContainer>
              <Button variant="sell" onClick={modalHandler(1)}>
                <FormattedMessage id="exchange.sell" />
              </Button>
            </CTAContainer>
            <Space size="tiny" />
            {REACT_APP_MOON_PAY_API_KEY && (
              <CTAContainer className="last-cta">
                <BuyWithMoonPay.Provider
                  mode={REACT_APP_MOON_PAY_MODE as MoonpayMode}
                  apiKey={REACT_APP_MOON_PAY_API_KEY}
                  signatureEndpoint={`${getDomain()}/api/v1/moonpay/sign`}
                >
                  <BuyWithMoonPay address={address} />
                </BuyWithMoonPay.Provider>
              </CTAContainer>
            )}
          </>
          <Modal open={open} position="bottom" onClose={() => setOpen(false)}>
            <Modal.Header title={<FormattedMessage id="exchange.placeOrder.limitOrder" />} />
            <Modal.Content>
              <SegmentedControl
                size="huge"
                selectedIndex={selectedIndex}
                onChange={({ selectedIndex }) => setSelectedIndex(selectedIndex)}
                className="small-viewport-limit-order-cta"
              >
                <span>
                  <FormattedMessage id="exchange.buy" />
                </span>
                <span>
                  <FormattedMessage id="exchange.sell" />
                </span>
              </SegmentedControl>
              {selectedIndex === 0 && <Ask />}
              {selectedIndex === 1 && <Bid />}
            </Modal.Content>
          </Modal>
          <GlobalStyles />
          <Warning open={warningOpen} onClose={() => setWarningOpen(false)} />
        </>
      ) : (
        <Container>
          <Title>
            <FormattedMessage id="exchange.placeOrder.limitOrder" />
            {REACT_APP_MOON_PAY_API_KEY && (
              <MoonPayContainer>
                <BuyWithMoonPay.Provider
                  mode={REACT_APP_MOON_PAY_MODE as MoonpayMode}
                  apiKey={REACT_APP_MOON_PAY_API_KEY}
                  signatureEndpoint={`${getDomain()}/api/v1/moonpay/sign`}
                >
                  <BuyWithMoonPay address={address} />
                </BuyWithMoonPay.Provider>
              </MoonPayContainer>
            )}
          </Title>
          <Forms>
            <Ask />
            <Bid />
          </Forms>
          <GlobalStyles />
        </Container>
      )}
    </>
  );
};
