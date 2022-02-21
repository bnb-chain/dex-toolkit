import styled from 'styled-components';
import { em } from 'polished';

export const LoadingModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;

  .loading {
    font-size: ${em(60)};
  }
`;

export const LoadingModalTitle = styled.h3`
  color: ${({ theme }) => theme.honeycomb.color.text.normal} !important;
  margin: ${({ theme }) => em(theme.honeycomb.size.normal)} 0;
`;

export const LoadingModalContent = styled.p`
  font-size: ${em(14)};
  color: ${({ theme }) => theme.honeycomb.color.text.masked};
`;
