import { AxiosError } from 'axios';

interface ErrorConfigParams {
  error: any;
  entityNameFormatted: string;
}

interface ApiErrorResponse {
  message?: string;
  error?: string | Array<{ message: string; field?: string }>;
  errors?: Array<{ message: string; field?: string }>;
  statusCode?: number;
}

/**
 * Centralized error handling configuration for API responses
 * @param error - The error object from the API call
 * @param entityNameFormatted - The formatted entity name for user-friendly messages
 * @returns A user-friendly error message
 */
export function PostErrorConfig({ error, entityNameFormatted }: ErrorConfigParams): string {
  console.log('🔍 Processing error:', error);

  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  // Handle Axios errors
  if (error.isAxiosError || error.response) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const responseData = axiosError.response?.data;
    const status = axiosError.response?.status;

    console.log('📡 Axios error response:', responseData);

    // Handle specific HTTP status codes
    switch (status) {
      case 400:
        return handleValidationErrors(responseData, entityNameFormatted);
      case 401:
        return 'Unauthorized access.';
      case 403:
        return 'Access denied.';
      case 404:
        return `${entityNameFormatted} not found.`;
      case 409:
        return handleConflictErrors(responseData, entityNameFormatted);
      case 422:
        return handleValidationErrors(responseData, entityNameFormatted);
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'Internal server error. Please try again later.';
      case 502:
        return 'Service temporarily unavailable. Please try again later.';
      case 503:
        return 'Service unavailable. Please try again later.';
      default:
        return extractErrorMessage(responseData, entityNameFormatted);
    }
  }

  // Handle network errors
  if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
    return 'Network error. Please check your internet connection.';
  }

  // Handle timeout errors
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return 'Request timeout. Please try again.';
  }

  // Handle direct error objects with error property
  if (error.error) {
    if (Array.isArray(error.error) && error.error.length > 0) {
      return error.error[0].message || `Error with ${entityNameFormatted}`;
    }
    if (typeof error.error === 'string') {
      return error.error;
    }
  }

  // Handle direct message property
  if (error.message) {
    return error.message;
  }

  // Fallback error message
  return `An unexpected error occurred with ${entityNameFormatted}. Please try again.`;
}

/**
 * Handle validation errors (400, 422)
 */
function handleValidationErrors(responseData: ApiErrorResponse | undefined, entityNameFormatted: string): string {
  if (!responseData) {
    return `Validation error with ${entityNameFormatted}. Please check your input.`;
  }

  // Handle array of errors
  if (responseData.errors && Array.isArray(responseData.errors)) {
    const firstError = responseData.errors[0];
    return firstError.message || `Validation error with ${entityNameFormatted}`;
  }

  // Handle error array
  if (responseData.error && Array.isArray(responseData.error)) {
    const firstError = responseData.error[0];
    return firstError.message || `Validation error with ${entityNameFormatted}`;
  }

  // Handle string error
  if (responseData.error && typeof responseData.error === 'string') {
    return responseData.error;
  }

  // Handle message
  if (responseData.message) {
    return responseData.message;
  }

  return `Validation error with ${entityNameFormatted}. Please check your input.`;
}

/**
 * Handle conflict errors (409) - usually duplicate entries
 */
function handleConflictErrors(responseData: ApiErrorResponse | undefined, entityNameFormatted: string): string {
  if (!responseData) {
    return `${entityNameFormatted} already exists.`;
  }

  // Check for duplicate entry messages
  const message = responseData.message || responseData.error;
  if (typeof message === 'string') {
    if (message.toLowerCase().includes('duplicate') || message.toLowerCase().includes('already exists')) {
      return message;
    }
  }

  // Handle array errors for duplicates
  if (responseData.error && Array.isArray(responseData.error)) {
    const duplicateError = responseData.error.find(err => 
      err.message.toLowerCase().includes('duplicate') || 
      err.message.toLowerCase().includes('already exists')
    );
    if (duplicateError) {
      return duplicateError.message;
    }
  }

  return `${entityNameFormatted} already exists or conflicts with existing data.`;
}

/**
 * Extract error message from response data
 */
function extractErrorMessage(responseData: ApiErrorResponse | undefined, entityNameFormatted: string): string {
  if (!responseData) {
    return `Error with ${entityNameFormatted}. Please try again.`;
  }

  // Priority order: errors array > error array > error string > message
  if (responseData.errors && Array.isArray(responseData.errors) && responseData.errors.length > 0) {
    return responseData.errors[0].message;
  }

  if (responseData.error) {
    if (Array.isArray(responseData.error) && responseData.error.length > 0) {
      return responseData.error[0].message;
    }
    if (typeof responseData.error === 'string') {
      return responseData.error;
    }
  }

  if (responseData.message) {
    return responseData.message;
  }

  return `Error with ${entityNameFormatted}. Please try again.`;
}

/**
 * Get field-specific error messages for form validation
 */
export function getFieldErrors(error: any): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  if (error?.response?.data?.errors && Array.isArray(error.response.data.errors)) {
    error.response.data.errors.forEach((err: { field?: string; message: string }) => {
      if (err.field) {
        fieldErrors[err.field] = err.message;
      }
    });
  }

  if (error?.response?.data?.error && Array.isArray(error.response.data.error)) {
    error.response.data.error.forEach((err: { field?: string; message: string }) => {
      if (err.field) {
        fieldErrors[err.field] = err.message;
      }
    });
  }

  return fieldErrors;
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: any): boolean {
  return (
    error.code === 'NETWORK_ERROR' ||
    error.message?.includes('Network Error') ||
    !error.response
  );
}

/**
 * Check if error is a timeout error
 */
export function isTimeoutError(error: any): boolean {
  return (
    error.code === 'ECONNABORTED' ||
    error.message?.includes('timeout')
  );
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: any): boolean {
  return error?.response?.status === 401;
}

/**
 * Check if error is a validation error
 */
export function isValidationError(error: any): boolean {
  const status = error?.response?.status;
  return status === 400 || status === 422;
}
