import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCampaignInsights } from '../store/slices/insightSlice';
import type { RootState, AppDispatch } from '../store';
import Loader from './Loader';

interface CampaignInsightsProps {
  campaignId: string;
}

const CampaignInsightsPanel: React.FC<CampaignInsightsProps> = ({ campaignId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { campaignInsights, loading } = useSelector((state: RootState) => state.insights);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  
  const insights = campaignInsights[campaignId];

  useEffect(() => {
    if (campaignId) {
      dispatch(fetchCampaignInsights(campaignId));
    }
  }, [campaignId, dispatch, timeRange]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const formatNumber = (value: number) => {
    return value.toLocaleString();
  };

  if (loading && !insights) return <Loader />;
  if (!insights) return null;

  const metrics = [
    {
      title: 'Impressions',
      value: formatNumber(insights.impressions),
      icon: '👁️',
      color: 'bg-blue-100 text-blue-800',
      description: 'Total views',
    },
    {
      title: 'Clicks',
      value: formatNumber(insights.clicks),
      icon: '🖱️',
      color: 'bg-green-100 text-green-800',
      description: 'Total clicks',
    },
    {
      title: 'Conversions',
      value: formatNumber(insights.conversions),
      icon: '📈',
      color: 'bg-purple-100 text-purple-800',
      description: 'Total conversions',
    },
    {
      title: 'Total Spend',
      value: formatCurrency(insights.spend),
      icon: '💰',
      color: 'bg-yellow-100 text-yellow-800',
      description: 'Total campaign spend',
    },
    {
      title: 'CTR',
      value: formatPercentage(insights.ctr),
      icon: '🎯',
      color: 'bg-indigo-100 text-indigo-800',
      description: 'Click-through rate',
    },
    {
      title: 'CPC',
      value: formatCurrency(insights.cpc),
      icon: '💵',
      color: 'bg-red-100 text-red-800',
      description: 'Cost per click',
    },
    {
      title: 'Conversion Rate',
      value: formatPercentage(insights.conversion_rate),
      icon: '📊',
      color: 'bg-teal-100 text-teal-800',
      description: 'Conversion percentage',
    },
  ];

  const performanceIndicators = [
    {
      label: 'ROI',
      value: '5.2x',
      status: 'good',
      change: '+12%',
    },
    {
      label: 'Engagement Rate',
      value: '3.8%',
      status: 'average',
      change: '+2%',
    },
    {
      label: 'Cost per Conversion',
      value: '$45.20',
      status: 'good',
      change: '-8%',
    },
    {
      label: 'Impressions to Click',
      value: '2.75%',
      status: 'needs_attention',
      change: '-1%',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Campaign Performance Insights</h3>
        <div className="flex gap-2">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`cursor-pointer px-3 py-1 rounded text-sm font-medium ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 text-sm text-gray-600">
        <p>Last updated: {new Date(insights.timestamp).toLocaleString()}</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{metric.icon}</span>
              <span className={`px-2 py-1 text-xs font-medium rounded ${metric.color}`}>
                {metric.title}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800 mb-1">{metric.value}</p>
            <p className="text-sm text-gray-600">{metric.description}</p>
          </div>
        ))}
      </div>

      {/* Performance Indicators */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Performance Indicators</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {performanceIndicators.map((indicator, index) => (
            <div
              key={index}
              className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{indicator.label}</span>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded ${
                    indicator.status === 'good'
                      ? 'bg-green-100 text-green-800'
                      : indicator.status === 'average'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {indicator.status.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-800">{indicator.value}</span>
                <span
                  className={`text-sm font-medium ${
                    indicator.change.startsWith('+')
                      ? 'text-green-600'
                      : indicator.change.startsWith('-')
                      ? 'text-red-600'
                      : 'text-gray-600'
                  }`}
                >
                  {indicator.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights Summary */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Insights Summary</h4>
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
            <p className="text-gray-700">
              This campaign has a <span className="font-semibold">CTR of {insights.ctr.toFixed(2)}%</span>, 
              which is above the industry average of 2%.
            </p>
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
            <p className="text-gray-700">
              With a <span className="font-semibold">conversion rate of {insights.conversion_rate.toFixed(2)}%</span>,
              the campaign is performing well in driving actions.
            </p>
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3"></div>
            <p className="text-gray-700">
              Total spend of <span className="font-semibold">${insights.spend.toLocaleString()}</span> with 
              a <span className="font-semibold">CPC of ${insights.cpc.toFixed(2)}</span>.
            </p>
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3"></div>
            <p className="text-gray-700">
              Recommendations: Consider increasing budget allocation for better-performing platforms 
              and A/B testing different ad creatives.
            </p>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="mt-8">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Detailed Metrics</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Metric
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Benchmark
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Impressions
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatNumber(insights.impressions)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  40,000
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Above Target
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Clicks
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatNumber(insights.clicks)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  1,000
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Above Target
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  CTR
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatPercentage(insights.ctr)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  2.00%
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Above Average
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Cost per Conversion
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${(insights.spend / insights.conversions).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  $50.00
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Below Target
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CampaignInsightsPanel;