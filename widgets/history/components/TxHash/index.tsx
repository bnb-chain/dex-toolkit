import { EXPLORER_URL } from '@dex-kit/utils/httpRequest';
import { HashLink } from '../styled';

const SLICE_NUM = 12;

export const TxHash = ({ txHash }: { txHash: string }) => {
  return (
    <HashLink href={`${EXPLORER_URL}/tx/${txHash}`} target="_blank" rel="noreferrer">
      {txHash.slice(0, SLICE_NUM)}...
    </HashLink>
  );
};
