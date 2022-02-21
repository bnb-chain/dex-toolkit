import { dateFormatter } from '@dex-kit/utils';

export const DateCell = ({ value }: { value: number | string }) => (
  <>{dateFormatter(new Date(value), false)}</>
);
