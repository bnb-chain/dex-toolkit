import httpRequest from '../../utils/httpRequest';

export const SET_NODE_INFO = 'SET_NODE_INFO';

export const SET_BLOCK_HEIGHT = 'SET_BLOCK_HEIGHT';

export const SET_PEERS = 'SET_PEERS';

export const SET_GLOBAL_LOADING = 'SET_GLOBAL_LOADING';

export const setPeers = (data) => (dispatch) =>
  dispatch({
    type: SET_PEERS,
    data,
  });

export const setNodeInfo = (data) => (dispatch) =>
  dispatch({
    type: SET_NODE_INFO,
    data,
  });

export const setBlockHeight = (data) => (dispatch) =>
  dispatch({
    type: SET_BLOCK_HEIGHT,
    data,
  });

export const setLoading = (data) => (dispatch) =>
  dispatch({
    type: SET_GLOBAL_LOADING,
    data,
  });

export const getNodeInfo = () => async (dispatch) => {
  try {
    const nodeInfo = await httpRequest.getNodeInfo();
    dispatch(setNodeInfo(nodeInfo));
  } catch (err) {
    console.log(`status:${err.status} message: ${err.statusText}`);
  }
};

export const getPeers = () => async (dispatch) => {
  try {
    const peers = await httpRequest.getPeers();
    dispatch(setPeers(peers));
  } catch (err) {
    console.log(`status:${err.status} message: ${err.statusText}`);
  }
};
