import axios, { AxiosError } from 'axios';
import type { ApiError, RateLimitError } from '../types';


const API_BASE_URL = 'https://mixo-fe-backend-task.vercel.app';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const apiError = error.response?.data as ApiError | RateLimitError;
    return Promise.reject(apiError);
  }
);

export const createEventSource = (campaignId: string) => {
  return new EventSource(`${API_BASE_URL}/campaigns/${campaignId}/insights/stream`);
};