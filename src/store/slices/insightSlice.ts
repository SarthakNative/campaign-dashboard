import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api, createEventSource } from '../../utils/api';
import type { ApiError, CampaignInsights, InsightsState, OverallInsights, RateLimitError } from '../../types';


const initialState: InsightsState = {
  overallInsights: null,
  campaignInsights: {},
  loading: false,
  error: null,
};

export const fetchOverallInsights = createAsyncThunk(
  'insights/fetchOverallInsights',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/campaigns/insights');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const fetchCampaignInsights = createAsyncThunk(
  'insights/fetchCampaignInsights',
  async (campaignId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/campaigns/${campaignId}/insights`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const subscribeToCampaignInsightsStream = (campaignId: string, onData: (data: CampaignInsights) => void) => {
  return (dispatch: any) => {
    const eventSource = createEventSource(campaignId);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as CampaignInsights;
        onData(data);
        // Update state with new data
        dispatch(updateCampaignInsights(data));
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  };
};

const insightSlice = createSlice({
  name: 'insights',
  initialState,
  reducers: {
    updateCampaignInsights: (state, action) => {
      const insights = action.payload as CampaignInsights;
      state.campaignInsights[insights.campaign_id] = insights;
    },
    clearInsightsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch overall insights
      .addCase(fetchOverallInsights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOverallInsights.fulfilled, (state, action) => {
        state.loading = false;
        state.overallInsights = action.payload.insights as OverallInsights;
      })
      .addCase(fetchOverallInsights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as ApiError | RateLimitError;
      })
      // Fetch campaign insights
      .addCase(fetchCampaignInsights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampaignInsights.fulfilled, (state, action) => {
        state.loading = false;
        const insights = action.payload.insights as CampaignInsights;
        state.campaignInsights[insights.campaign_id] = insights;
      })
      .addCase(fetchCampaignInsights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as ApiError | RateLimitError;
      });
  },
});

export const { updateCampaignInsights, clearInsightsError } = insightSlice.actions;
export default insightSlice.reducer;