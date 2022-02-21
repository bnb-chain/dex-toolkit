import { AnyAction } from 'redux';
import * as actionTypes from './action';

export const INITIAL_STATE = {
  curIndicators: {
    curOver: 'MA',
    curInd: 'MACD',
  },
  isDataLoading: {},
};

const chart = (state = INITIAL_STATE, action: AnyAction) => {
  switch (action.type) {
    case actionTypes.CHANGE_CHART_INDICATOR:
      return {
        ...state,
        curIndicators: {
          ...state.curIndicators,
          ...action.curInd,
        },
      };
    case actionTypes.IS_DATA_LOADING:
      return {
        ...state,
        isDataLoading: {
          ...state.isDataLoading,
          [action.key]: action.isLoading,
        },
      };
    default:
      return state;
  }
};

export default chart;
