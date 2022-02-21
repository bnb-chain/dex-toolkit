import { SET_NODE_INFO, SET_BLOCK_HEIGHT, SET_PEERS, SET_GLOBAL_LOADING } from './action';

const initialState = {
  nodeInfo: {},
  blockHeight: 0,
  isLoading: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_NODE_INFO:
      return {
        ...state,
        nodeInfo: action.data,
      };

    case SET_BLOCK_HEIGHT:
      return {
        ...state,
        blockHeight: action.data,
      };

    case SET_PEERS:
      return {
        ...state,
        peers: action.data,
      };

    case SET_GLOBAL_LOADING:
      return {
        ...state,
        isLoading: action.data,
      };

    default:
      return state;
  }
};
