import { AppDispatch } from '@dex-kit/store/store';

export const CHANGE_CHART_INDICATOR = 'CHANGE_CHART_INDICATOR';
export const IS_DATA_LOADING = 'IS_DATA_LOADING';

export const setDataIsLoading = (data: any) => (dispatch: AppDispatch) =>
  dispatch({ type: IS_DATA_LOADING, ...data });

export const setChartIndicator = (curInd: any) => (dispatch: AppDispatch) =>
  dispatch({ type: CHANGE_CHART_INDICATOR, curInd });
