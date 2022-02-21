import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';

import { rootReducer } from '.';

const middleware = [thunk];

export const store = configureStore({
  reducer: rootReducer,
  middleware,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
