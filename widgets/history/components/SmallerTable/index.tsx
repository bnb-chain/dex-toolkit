import { TableOptions } from 'react-table';
import { FormattedMessage } from 'react-intl';
import { Button, Space } from '@binance-chain/honeycomb';

import reduceTradePairBSuffix from '@dex-kit/utils/tradepair';

import { Side } from '../Side';
import { Status } from '../Status';
import { Side as SideType, Status as StatusType } from '../types';

import {
  StyledCard,
  Container,
  RowContainer,
  Brief,
  LeftBrief,
  RightBrief,
  Row,
  Header,
  Cell,
} from './styled';

type Props<Data extends object> = {
  data: TableOptions<Data>['data'];
  columns: TableOptions<Data>['columns'];
  accessors: Array<string>;
  cancellable?: Function;
  useFilledValue?: boolean;
  usePairUtil?: boolean;
};

export const SmallerTable = <Data extends object>({
  data = [],
  columns,
  accessors,
  cancellable,
  useFilledValue = false,
  usePairUtil = true,
}: Props<Data>) => {
  if (!data || data.length === 0) return null;
  return (
    <Container>
      <StyledCard>
        {data &&
          data.map((el: any, index) => (
            <RowContainer key={`smaller-table-data-${index}`}>
              <Brief>
                <LeftBrief>
                  {
                    <>
                      {usePairUtil
                        ? el.pair && reduceTradePairBSuffix(el.pair).split('_').join(' / ')
                        : [el.baseAsset, el.quoteAsset].join(' / ')}
                    </>
                  }
                  {<>{el.asset && el.name && `${el.asset} / ${el.name}`}</>}
                  <Space size="micro" />
                  {el.side && <Side side={el.side as SideType}>{el.side}</Side>}
                  <Space size="micro" />
                  {useFilledValue && el.filled && el.filled}
                  {el.status && (
                    <>
                      <Status status={el.status as StatusType} />
                    </>
                  )}
                </LeftBrief>
                {cancellable && (
                  <RightBrief>
                    <Button htmlTag="a" variant="link" href="#" onClick={cancellable(el)}>
                      <FormattedMessage id="common.cancel" />
                    </Button>
                  </RightBrief>
                )}
              </Brief>
              {accessors &&
                accessors.map((accessor, accessorIndex) => {
                  const targetColumn: any =
                    columns.find((column) => column.accessor === accessor) || columns[0];
                  const targetValue = el[accessor];
                  const cellValue = { value: targetValue };

                  return (
                    <Row key={`smaller-table-row-${accessorIndex}`}>
                      <Header>{targetColumn.Header}</Header>
                      <Cell>{targetColumn.Cell ? targetColumn.Cell(cellValue) : targetValue}</Cell>
                    </Row>
                  );
                })}
            </RowContainer>
          ))}
      </StyledCard>
    </Container>
  );
};
