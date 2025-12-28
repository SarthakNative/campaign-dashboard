import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';


import Loader from './Loader';
import { fetchOverallInsights } from '../store/slices/insightSlice';
import type { AppDispatch, RootState } from '../store';

const InsightsOverview: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { overallInsights, loading } = useSelector((state: RootState) => state.insights);

  useEffect(() => {
    dispatch(fetchOverallInsights());
  }, [dispatch]);

  if (loading) return <Loader />;
  if (!overallInsights) return null;

  const stats = [
    {
      title: 'Total Campaigns',
      value: overallInsights.total_campaigns,
      change: null,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Campaigns',
      value: overallInsights.active_campaigns,
      change: null,
      color: 'bg-green-500',
    },
    {
      title: 'Total Impressions',
      value: overallInsights.total_impressions.toLocaleString(),
      change: null,
      color: 'bg-purple-500',
    },
    {
      title: 'Total Clicks',
      value: overallInsights.total_clicks.toLocaleString(),
      change: null,
      color: 'bg-yellow-500',
    },
    {
      title: 'Total Conversions',
      value: overallInsights.total_conversions.toLocaleString(),
      change: null,
      color: 'bg-pink-500',
    },
    {
      title: 'Total Spend',
      value: `$${overallInsights.total_spend.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      change: null,
      color: 'bg-red-500',
    },
    {
      title: 'Avg CTR',
      value: `${overallInsights.avg_ctr.toFixed(2)}%`,
      change: null,
      color: 'bg-indigo-500',
    },
    {
      title: 'Avg CPC',
      value: `$${overallInsights.avg_cpc.toFixed(2)}`,
      change: null,
      color: 'bg-teal-500',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Performance Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-lg p-4 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} w-12 h-12 rounded-full flex items-center justify-center`}>
                <span className="text-white font-bold text-lg">{stat.value.toString().charAt(0)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsightsOverview;