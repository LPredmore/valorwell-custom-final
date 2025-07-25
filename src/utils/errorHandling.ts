/**
 * Enterprise error handling utilities
 * Provides consistent error handling, logging, and user feedback
 */

export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  userId?: string;
  context?: Record<string, any>;
}

export class AppointmentError extends Error {
  public readonly code: string;
  public readonly details?: any;
  public readonly context?: Record<string, any>;

  constructor(
    code: string,
    message: string,
    details?: any,
    context?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppointmentError';
    this.code = code;
    this.details = details;
    this.context = context;
  }
}

// Error codes for common appointment scenarios
export const ERROR_CODES = {
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  SCHEDULE_CONFLICT: 'SCHEDULE_CONFLICT',
  CLIENT_NOT_FOUND: 'CLIENT_NOT_FOUND',
  CLINICIAN_NOT_FOUND: 'CLINICIAN_NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  VIDEO_ROOM_CREATION_FAILED: 'VIDEO_ROOM_CREATION_FAILED',
  TIMEZONE_ERROR: 'TIMEZONE_ERROR',
  RECURRING_CREATION_FAILED: 'RECURRING_CREATION_FAILED',
} as const;

/**
 * Handles and formats errors for user consumption
 */
export const handleAppointmentError = (error: any): AppError => {
  const timestamp = new Date();
  
  // If it's already our custom error
  if (error instanceof AppointmentError) {
    return {
      code: error.code,
      message: error.message,
      details: error.details,
      timestamp,
      context: error.context,
    };
  }
  
  // Handle Supabase errors
  if (error?.code) {
    return {
      code: ERROR_CODES.DATABASE_ERROR,
      message: formatSupabaseError(error),
      details: error,
      timestamp,
    };
  }
  
  // Handle network errors
  if (error?.name === 'NetworkError' || error?.message?.includes('fetch')) {
    return {
      code: ERROR_CODES.NETWORK_ERROR,
      message: 'Unable to connect to the server. Please check your internet connection.',
      details: error,
      timestamp,
    };
  }
  
  // Generic error
  return {
    code: 'UNKNOWN_ERROR',
    message: error?.message || 'An unexpected error occurred',
    details: error,
    timestamp,
  };
};

/**
 * Formats Supabase errors for user consumption
 */
const formatSupabaseError = (error: any): string => {
  switch (error.code) {
    case '23505': // unique_violation
      return 'This appointment conflicts with an existing appointment.';
    case '23503': // foreign_key_violation
      return 'The selected client or clinician is no longer available.';
    case '42501': // insufficient_privilege
      return 'You do not have permission to perform this action.';
    case 'PGRST116': // Row Level Security
      return 'Access denied. Please check your permissions.';
    default:
      return error.message || 'A database error occurred.';
  }
};

/**
 * Logs errors for monitoring and debugging
 */
export const logError = (error: AppError, userId?: string) => {
  // In production, this would send to a logging service
  console.error('Application Error:', {
    ...error,
    userId,
    userAgent: navigator.userAgent,
    url: window.location.href,
  });
  
  // Could integrate with services like Sentry, DataDog, etc.
};

/**
 * Provides user-friendly error messages
 */
export const getUserErrorMessage = (error: AppError): string => {
  switch (error.code) {
    case ERROR_CODES.SCHEDULE_CONFLICT:
      return 'This time slot conflicts with another appointment. Please choose a different time.';
    case ERROR_CODES.CLIENT_NOT_FOUND:
      return 'The selected client could not be found. Please refresh and try again.';
    case ERROR_CODES.CLINICIAN_NOT_FOUND:
      return 'The selected clinician is no longer available.';
    case ERROR_CODES.UNAUTHORIZED:
      return 'You do not have permission to perform this action.';
    case ERROR_CODES.NETWORK_ERROR:
      return 'Unable to connect to the server. Please check your internet connection and try again.';
    case ERROR_CODES.VIDEO_ROOM_CREATION_FAILED:
      return 'Failed to create video room. The appointment was created but video calling may not be available.';
    case ERROR_CODES.TIMEZONE_ERROR:
      return 'There was an issue with timezone conversion. Please verify the appointment time.';
    case ERROR_CODES.RECURRING_CREATION_FAILED:
      return 'Some recurring appointments could not be created due to scheduling conflicts.';
    default:
      return error.message || 'An unexpected error occurred. Please try again.';
  }
};

/**
 * Determines if an error should trigger a retry
 */
export const shouldRetry = (error: AppError): boolean => {
  const retryableCodes = [
    ERROR_CODES.NETWORK_ERROR,
    ERROR_CODES.DATABASE_ERROR,
  ];
  
  return retryableCodes.includes(error.code as any);
};

/**
 * Creates a standardized error response for API endpoints
 */
export const createErrorResponse = (error: AppError) => {
  return {
    success: false,
    error: {
      code: error.code,
      message: getUserErrorMessage(error),
      details: error.details,
      timestamp: error.timestamp,
    },
  };
};