import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideErrorDialog } from '../store/slices/uiSlice';
import type { RateLimitError } from '../types';
import type { RootState } from '../store';


const ErrorDialog: React.FC = () => {
  const dispatch = useDispatch();
  const { open, error } = useSelector((state: RootState) => state.ui.errorDialog);

  if (!open || !error) return null;

  const isRateLimitError = 'retry_after' in error;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-red-600">Error {error.status}</h2>
          <button
            onClick={() => dispatch(hideErrorDialog())}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-3">
          <div>
            <p className="font-semibold text-gray-700">{error.error}</p>
            <p className="text-gray-600 mt-1">{error.message}</p>
          </div>
          
          {isRateLimitError && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
              <p className="text-yellow-700">
                Please retry after {(error as RateLimitError).retry_after} seconds
              </p>
            </div>
          )}
          
          <div className="text-sm text-gray-500">
            <p>Timestamp: {new Date(error.timestamp).toLocaleString()}</p>
            {error.path && <p>Path: {error.path}</p>}
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => dispatch(hideErrorDialog())}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorDialog;