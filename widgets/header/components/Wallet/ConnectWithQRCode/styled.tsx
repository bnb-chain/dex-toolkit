import styled from 'styled-components';
import { em } from 'polished';

export const Title = styled.span`
  color: ${({ theme }) => theme.honeycomb.color.text.normal};
  margin-right: ${({ theme }) => em(theme.honeycomb.size.tiny)};
`;

export const QRCodeContainer = styled.div`
  color: ${({ theme }) => theme.honeycomb.color.text.normal};
  display: flex;
  justify-content: center;
`;

export const TextNote = styled.p`
  color: ${({ theme }) => theme.honeycomb.color.text.normal};
  padding: ${({ theme }) => em(theme.honeycomb.size.increased)} 0;
  font-size: ${({ theme }) => em(theme.honeycomb.size.reduced)};
  text-align: center;

  > span {
    margin-left: ${({ theme }) => em(theme.honeycomb.size.micro)};

    > a {
      color: ${({ theme }) => theme.honeycomb.color.text.primary};
      text-decoration: none;

      &:hover {
        color: ${({ theme }) => theme.honeycomb.color.primary.normal};
        font-weight: 500;
        text-decoration: none;
      }
    }
  }
`;
