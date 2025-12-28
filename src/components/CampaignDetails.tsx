import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCampaignById } from '../store/slices/campaignSlice';
import { fetchCampaignInsights, subscribeToCampaignInsightsStream } from '../store/slices/insightSlice';
import type { RootState, AppDispatch } from '../store';
import Loader from './Loader';
import CampaignInsightsPanel from './CampaignInsights';


const CampaignDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedCampaign, loading } = useSelector((state: RootState) => state.campaigns);
  const { campaignInsights } = useSelector((state: RootState) => state.insights);
  const [showInsights, setShowInsights] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchCampaignById(id));
      dispatch(fetchCampaignInsights(id));
    }
  }, [id, dispatch]);

  const insights = id ? campaignInsights[id] : null;

  const handleStreamToggle = () => {
    if (!id) return;

    if (isStreaming) {
      setIsStreaming(false);
    } else {
      setIsStreaming(true);
      const unsubscribe = dispatch(
        subscribeToCampaignInsightsStream(id, (data) => {
          console.log('Real-time update:', data);
        })
      );

      return unsubscribe;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <Loader />;
  if (!selectedCampaign) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          ← Back to Campaigns
        </button>
        <div className="flex gap-3">
          <button
            onClick={() => setShowInsights(!showInsights)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            {showInsights ? 'Hide Insights' : 'Show Insights'}
          </button>
          <button
            onClick={handleStreamToggle}
            className={`px-4 py-2 rounded transition-colors ${
              isStreaming
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isStreaming ? 'Stop Live Updates' : 'Start Live Updates'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">{selectedCampaign.name}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedCampaign.status)}`}>
                {selectedCampaign.status.toUpperCase()}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600">Campaign ID</p>
                <p className="font-medium">{selectedCampaign.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Brand ID</p>
                <p className="font-medium">{selectedCampaign.brand_id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Budget</p>
                <p className="font-medium text-lg">${selectedCampaign.budget.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Daily Budget</p>
                <p className="font-medium text-lg">${selectedCampaign.daily_budget.toLocaleString()}</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Platforms</p>
              <div className="flex flex-wrap gap-2">
                {selectedCampaign.platforms.map((platform) => (
                  <span
                    key={platform}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">Created At</p>
              <p className="font-medium">
                {new Date(selectedCampaign.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
            
            {insights && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Impressions</span>
                  <span className="font-bold text-gray-800">
                    {insights.impressions.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Clicks</span>
                  <span className="font-bold text-gray-800">
                    {insights.clicks.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Conversions</span>
                  <span className="font-bold text-gray-800">
                    {insights.conversions.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Spend</span>
                  <span className="font-bold text-gray-800">
                    ${insights.spend.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">CTR</span>
                  <span className="font-bold text-gray-800">
                    {insights.ctr.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">CPC</span>
                  <span className="font-bold text-gray-800">
                    ${insights.cpc.toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {!insights && (
              <div className="text-center py-4">
                <p className="text-gray-500">No insights data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showInsights && id && (
        <div className="mt-8">
          <CampaignInsightsPanel campaignId={id} />
        </div>
      )}

      {isStreaming && (
        <div className="mt-4 flex items-center gap-2 text-green-600">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">Receiving live updates...</span>
        </div>
      )}
    </div>
  );
};

export default CampaignDetails;