import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { Icon } from '@binance-chain/honeycomb';
import { EXPLORER_URL, isMainnet, getDomain } from '@dex-kit/utils/httpRequest';
import { LOCALES, getMiniTokenLocale } from '@dex-kit/utils/locales';
import { RootState } from '@dex-kit/store/store';
import { useWindowSize } from '@dex-kit/hooks';

import { WalletInfo } from '../Wallet/Info';
import { Accelerated } from '../Accelerated';

export const useMenu = () => {
  const { address } = useSelector((state: RootState) => state.account);
  const { locale }: { locale: string } = useIntl();
  const { tradePath } = useParams<{ tradePath: string }>();
  const history = useHistory();
  const { isSm } = useWindowSize();
  const { selected, options } = Accelerated();
  const [showCreateWalletModal, setShowCreateWalletModal] = useState(false);
  const [showUnlockWalletModal, setShowUnlockWalletModal] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);

  const leftItems = useMemo(
    () =>
      !isSm && [
        {
          element: selected,
          children: options,
        },
      ],
    [isSm, selected, options],
  );

  const rightItems = useMemo(() => {
    const base = [
      {
        element: <FormattedMessage id="header.explorer" />,
        htmlTag: 'a' as const,
        href: `${EXPLORER_URL}`,
        target: '_blank',
        rel: 'noreferrer',
      },
      {
        element: <FormattedMessage id="header.exchange" />,
        children: [
          {
            element: <FormattedMessage id="header.exchange.bep2" />,
            htmlTag: 'a' as const,
            href: `${getDomain()}/${locale}/${tradePath}`,
          },
          {
            element: <FormattedMessage id="header.exchange.bep8" />,
            htmlTag: 'a' as const,
            href: `${getDomain()}/${getMiniTokenLocale(locale)}/trade/mini`,
          },
        ],
      },
    ];

    let right = [];

    if (address === '') {
      right = [
        ...base,
        {
          element: <FormattedMessage id="header.createWallet" />,
          htmlTag: 'a' as const,
          href: '#',
          onClick: () => setShowCreateWalletModal(!showCreateWalletModal),
        },
        {
          element: <FormattedMessage id="header.unlockWallet" />,
          htmlTag: 'a' as const,
          href: '#',
          onClick: () => setShowUnlockWalletModal(!showUnlockWalletModal),
        },
      ];
    } else {
      right = [
        ...base,
        {
          element: <FormattedMessage id="header.orders" />,
          children: [
            {
              element: <FormattedMessage id="header.openOrders" />,
              htmlTag: 'a' as const,
              href: `${getDomain()}/${locale}/openOrders`,
            },
            {
              element: <FormattedMessage id="header.orderHistory" />,
              htmlTag: 'a' as const,
              href: `${getDomain()}/${locale}/orderHistory`,
            },
            {
              element: <FormattedMessage id="header.tradeHistory" />,
              htmlTag: 'a' as const,
              href: `${getDomain()}/${locale}/tradeHistory`,
            },
            {
              element: <FormattedMessage id="header.feeHistory" />,
              htmlTag: 'a' as const,
              href: `${getDomain()}/${locale}/feeHistory`,
            },
          ],
        },
        {
          element: <FormattedMessage id="header.transactions" />,
          htmlTag: 'a' as const,
          href: `${getDomain()}/${locale}/transactionHistory`,
        },
        {
          element: <FormattedMessage id="header.balances" />,
          htmlTag: 'a' as const,
          href: `${getDomain()}/${locale}/balances`,
          showBorder: isSm,
        },
      ];
    }

    if (isSm) {
      right.push({
        element: selected,
        // @ts-ignore
        children: options,
        showBorder: true,
        className: 'accelerated-button',
      });
    }

    return right;
  }, [
    address,
    isSm,
    locale,
    options,
    selected,
    showCreateWalletModal,
    showUnlockWalletModal,
    tradePath,
  ]);

  const nonCollapsibleItems = useMemo(() => {
    let base = [
      {
        element: <>{LOCALES[locale]}</>,
        children: Object.keys(LOCALES).map((el: string) => ({
          element: LOCALES[el],
          htmlTag: 'a' as const,
          onClick: () => {
            history.push(`/${el}/${tradePath}`);
          },
        })),
        collapseOn: 'md' as const,
      },
      {
        element: <Icon.Ellipsis />,
        children: [
          {
            element: <FormattedMessage id="header.faq" />,
            htmlTag: 'a' as const,
            href: `https://docs.binance.org`,
          },
          {
            element: <FormattedMessage id="header.forums" />,
            htmlTag: 'a' as const,
            href: `https://community.binance.org`,
          },
          {
            element: <FormattedMessage id="header.blog" />,
            htmlTag: 'a' as const,
            href: `${getDomain()}/${locale}/blog`,
          },
          {
            element: isMainnet ? (
              <FormattedMessage id="header.mainnet" />
            ) : (
              <FormattedMessage id="header.testnet" />
            ),
            htmlTag: 'a' as const,
            href: `${getDomain()}/${locale}`,
          },
        ],
        collapseOn: 'md' as const,
      },
    ];

    if (address && address !== '') {
      base = [
        {
          element: (
            <WalletInfo
              unlock={() => setShowUnlockWalletModal(true)}
              disconnect={() => setShowDisconnectModal(true)}
            />
          ),
          /* @ts-ignore */
          interactive: false,
        },
        ...base,
      ];
    }

    return base;
  }, [address, history, locale, tradePath]);

  return {
    showCreateWalletModal,
    showUnlockWalletModal,
    showDisconnectModal,
    setShowCreateWalletModal,
    setShowUnlockWalletModal,
    setShowDisconnectModal,
    nonCollapsibleItems,
    rightItems,
    leftItems,
  };
};
