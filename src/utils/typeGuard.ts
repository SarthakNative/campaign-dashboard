import type { ApiError, RateLimitError } from "../types";

export const isApiError = (
  payload: unknown
): payload is ApiError | RateLimitError => {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'message' in payload
  );
};