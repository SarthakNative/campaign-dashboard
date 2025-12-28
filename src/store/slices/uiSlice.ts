import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ApiError, RateLimitError, UIState } from '../../types';


const initialState: UIState = {
  errorDialog: {
    open: false,
    error: null,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showErrorDialog: (state, action: PayloadAction<ApiError | RateLimitError>) => {
      state.errorDialog.open = true;
      state.errorDialog.error = action.payload;
    },
    hideErrorDialog: (state) => {
      state.errorDialog.open = false;
      state.errorDialog.error = null;
    },
  },
});

export const { showErrorDialog, hideErrorDialog } = uiSlice.actions;
export default uiSlice.reducer;