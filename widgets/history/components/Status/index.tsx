import { Status as StatusType } from '../types';
import { StyledBadge } from './styled';

export const Status = ({ status }: { status: StatusType }) => {
  if (status.toLowerCase() === 'filled') {
    return <StyledBadge variant="success">{status}</StyledBadge>;
  }

  if (status.toLowerCase() === 'partial') {
    return <StyledBadge variant="warning">{status}</StyledBadge>;
  }

  if (status.toLowerCase() === 'canceled') {
    return <StyledBadge variant="cancel">{status}</StyledBadge>;
  }

  if (status.toLowerCase() === 'failed' || status.toLowerCase() === 'expired') {
    return <StyledBadge variant="danger">{status}</StyledBadge>;
  }

  return <>{status}</>;
};
