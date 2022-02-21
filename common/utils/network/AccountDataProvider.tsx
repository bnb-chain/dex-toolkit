import { Component, Fragment } from 'react';
import cloneDeep from 'lodash-es/cloneDeep';
import { connect } from 'react-redux';
import ExchangeDataProvider from './ExchangeDataProvider';
import { RootState } from '@dex-kit/store/store';
import { setUserInfo } from '@dex-kit/store/account/action';
import { setOpenOrder } from '@dex-kit/store/order/action';

type Props = {
  address: string;
  currentTrade: string;
  dispatch: Function;
  openOrders: Array<any>;
  userInfo: any;
};

class AccountDataProvider extends Component<Props> {
  static defaultProps = {
    address: '',
    currentTrade: '',
    dispatch: () => {},
    openOrders: [],
    userInfo: {},
  };

  _socketReceivedBatch = (data: any) => {
    const { openOrders, dispatch, userInfo } = this.props;
    const orders = data.filter((d: any) => d.e === 'executionReport');
    const account = data.find((d: any) => d.e === 'outboundAccountInfo') || {};
    const newOpenOrders: Array<any> = [];
    openOrders.forEach((order) => {
      const changedOrder = orders.find((o: any) => o.i === order.orderId);
      if (!changedOrder) {
        newOpenOrders.push(order);
        return;
      }

      if (parseFloat(order.quantity) !== parseFloat(changedOrder.z)) {
        order.cumulateQuantity = changedOrder.z;
        newOpenOrders.push(order);
      }
    });

    const newBalances: Array<any> = [];
    account.B &&
      account.B.forEach((balance: any) => {
        newBalances.push({
          symbol: balance.a,
          free: balance.f,
          locked: balance.l,
          frozen: balance.r,
        });
      });
    const newUserInfo = cloneDeep(userInfo);
    newUserInfo.balances = newBalances;

    dispatch(setUserInfo(newUserInfo));
    dispatch(setOpenOrder({ order: newOpenOrders }));
  };

  render() {
    const { currentTrade, address } = this.props;
    if (!address || !currentTrade) {
      return null;
    }
    return (
      <Fragment>
        <ExchangeDataProvider
          socketReceivedBatch={this._socketReceivedBatch}
          symbol={currentTrade}
          stream={`ws/${address}`}
          topic="orders"
        />
      </Fragment>
    );
  }
}

const mapStateToProps = ({
  account: {
    userInfo: { address },
    userInfo,
  },
  exchange: { currentTrade },
  order: { openOrders },
}: RootState) => ({
  address,
  currentTrade,
  userInfo,
  openOrders: openOrders.order,
});

export default connect(mapStateToProps)(AccountDataProvider);
