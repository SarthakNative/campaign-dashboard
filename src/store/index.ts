import { configureStore, isRejectedWithValue } from '@reduxjs/toolkit';
import campaignReducer from './slices/campaignSlice';
import insightReducer from './slices/insightSlice';
import uiReducer from './slices/uiSlice';
import type { Middleware } from '@reduxjs/toolkit';
import { showErrorDialog } from './slices/uiSlice';
import { isApiError } from '../utils/typeGuard';


export const rtkQueryErrorLogger: Middleware =
  (api) => (next) => (action) => {
    if (isRejectedWithValue(action) && isApiError(action.payload)) {
      api.dispatch(showErrorDialog(action.payload));
    }
    return next(action);
  };


export const store = configureStore({
  reducer: {
    campaigns: campaignReducer,
    insights: insightReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(rtkQueryErrorLogger),
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;