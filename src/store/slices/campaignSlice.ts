import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../utils/api';
import type { ApiError, CampaignState, RateLimitError } from '../../types';


const initialState: CampaignState = {
  campaigns: [],
  selectedCampaign: null,
  total: 0,
  loading: false,
  error: null,
};

export const fetchCampaigns = createAsyncThunk(
  'campaigns/fetchCampaigns',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/campaigns');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const fetchCampaignById = createAsyncThunk(
  'campaigns/fetchCampaignById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/campaigns/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

const campaignSlice = createSlice({
  name: 'campaigns',
  initialState,
  reducers: {
    clearSelectedCampaign: (state) => {
      state.selectedCampaign = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch campaigns
      .addCase(fetchCampaigns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampaigns.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns = action.payload.campaigns;
        state.total = action.payload.total;
      })
      .addCase(fetchCampaigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as ApiError | RateLimitError;
      })
      // Fetch campaign by ID
      .addCase(fetchCampaignById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampaignById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCampaign = action.payload.campaign;
      })
      .addCase(fetchCampaignById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as ApiError | RateLimitError;
      });
  },
});

export const { clearSelectedCampaign, clearError } = campaignSlice.actions;
export default campaignSlice.reducer;