import { FormattedMessage } from 'react-intl';
import { Modal } from '@binance-chain/honeycomb';

import {
  Connection,
  Option,
  OptionContent,
  LeftContent,
  TypeName,
  ImgWrap,
  BinanceChain,
  LeftSide,
} from '../styled';

const CHROME_WE_STORE_URL =
  'https://chrome.google.com/webstore/detail/binance-chain-wallet/fhbohimaelbohpjbbldcngcnapndodjp';

export const CreateWallet = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header title={<FormattedMessage id="createWallet.modal.title" />} />
      <Modal.Content>
        <Connection>
          <Option href={CHROME_WE_STORE_URL} target="_blank">
            <OptionContent>
              <LeftSide>
                <TypeName>
                  <FormattedMessage id="createWallet.option.install.extension.title" />
                </TypeName>
              </LeftSide>
              <LeftContent>
                <FormattedMessage id="createWallet.option.install.extension.content" />
              </LeftContent>
            </OptionContent>
            <ImgWrap>
              <BinanceChain />
            </ImgWrap>
          </Option>
        </Connection>
      </Modal.Content>
    </Modal>
  );
};
