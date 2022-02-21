import { AnyAction } from 'redux';
import { SET_BLOCK_FEE_HISTORY, SET_FEES } from './action';

const initialState = {
  blockFeeHistory: {},
  fees: [],
  transferFee: 0,
  issueFeeForBep2: 0,
  issueTinyFee: 0,
  issueMiniFee: 0,
};

const BASE_NUMBER = 10 ** 8;

const getTransferFee = (fees: Array<any>) => {
  for (let i = 0, len = fees.length; i < len; i++) {
    const feeObj = fees[i] || {};
    if (feeObj.fixed_fee_params) {
      return feeObj.fixed_fee_params.fee / BASE_NUMBER;
    }
  }
  return 0;
};

const splitFees = (fees: Array<any>) => {
  const issueMsg = fees.find((item) => item.msg_type === 'issueMsg');
  const issueTinyMsg = fees.find((item) => item.msg_type === 'tinyIssueMsg');
  const issueMiniMsg = fees.find((item) => item.msg_type === 'miniIssueMsg');

  return {
    issueFeeForBep2: issueMsg?.fee / BASE_NUMBER,
    issueTinyFee: issueTinyMsg?.fee / BASE_NUMBER,
    issueMiniFee: issueMiniMsg?.fee / BASE_NUMBER,
  };
};

const fees = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case SET_BLOCK_FEE_HISTORY:
      return {
        ...state,
        blockFeeHistory: action.data,
      };

    case SET_FEES:
      return {
        ...state,
        fees: action.data,
        ...splitFees(action.data),
        transferFee: getTransferFee(action.data),
      };
    default:
      return state;
  }
};

export default fees;
