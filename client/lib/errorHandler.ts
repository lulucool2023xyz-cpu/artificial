/**
 * Global Error Handler Utility
 * Provides consistent error handling, logging, and user feedback across the application
 */

import { toast } from "@/hooks/use-toast";

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  additionalData?: Record<string, unknown>;
}

export class AppError extends Error {
  public readonly context?: ErrorContext;
  public readonly timestamp: Date;
  public readonly userMessage: string;

  constructor(message: string, userMessage?: string, context?: ErrorContext) {
    super(message);
    this.name = 'AppError';
    this.userMessage = userMessage || message;
    this.context = context;
    this.timestamp = new Date();

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

/**
 * Log error to console with formatted output
 */
export function logError(error: Error | AppError, context?: ErrorContext): void {
  const isAppError = error instanceof AppError;
  const errorContext = isAppError ? error.context : context;

  console.group(
    `🔴 Error: ${error.name} - ${new Date().toLocaleTimeString()}`
  );
  console.error('Message:', error.message);
  
  if (errorContext) {
    console.error('Context:', errorContext);
  }
  
  if (error.stack) {
    console.error('Stack:', error.stack);
  }
  
  console.groupEnd();

  // In production, send to error tracking service (e.g., Sentry)
  if (process.env.NODE_ENV === 'production') {
    // Example: Sentry.captureException(error, { extra: errorContext });
  }
}

/**
 * Handle error and show user-friendly toast notification
 */
export function handleError(
  error: Error | AppError | unknown,
  context?: ErrorContext
): void {
  let errorMessage = 'An unexpected error occurred';
  let technicalMessage = '';

  if (error instanceof AppError) {
    errorMessage = error.userMessage;
    technicalMessage = error.message;
    logError(error);
  } else if (error instanceof Error) {
    technicalMessage = error.message;
    errorMessage = getUserFriendlyMessage(error);
    logError(error, context);
  } else if (typeof error === 'string') {
    errorMessage = error;
    console.error('🔴 Error:', error);
  } else {
    console.error('🔴 Unknown error:', error);
  }

  // Show toast notification
  toast({
    variant: "destructive",
    title: "Error",
    description: errorMessage,
    duration: 5000,
  });
}

/**
 * Convert technical errors to user-friendly messages
 */
export function getUserFriendlyMessage(error: Error): string {
  const message = error.message.toLowerCase();

  // Network errors
  if (message.includes('network') || message.includes('fetch failed')) {
    return 'Network error. Please check your internet connection.';
  }
  if (message.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }
  if (message.includes('chunklloaderror') || message.includes('loading chunk')) {
    return 'Failed to load content. Please refresh the page.';
  }

  // Authentication errors
  if (message.includes('unauthorized') || message.includes('401')) {
    return 'You need to log in to access this feature.';
  }
  if (message.includes('forbidden') || message.includes('403')) {
    return 'You don\'t have permission to access this.';
  }

  // Not found errors
  if (message.includes('not found') || message.includes('404')) {
    return 'The requested resource was not found.';
  }

  // Server errors
  if (message.includes('500') || message.includes('internal server')) {
    return 'Server error. Please try again later.';
  }

  // Validation errors
  if (message.includes('validation') || message.includes('invalid')) {
    return 'Invalid input. Please check your data and try again.';
  }

  // Default message
  return 'Something went wrong. Please try again.';
}

/**
 * Async function wrapper with error handling
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: ErrorContext
): T {
  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, context);
      throw error; // Re-throw to allow caller to handle if needed
    }
  }) as T;
}

/**
 * Async function wrapper with error handling and fallback value
 */
export function withErrorHandlingAndFallback<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  fallbackValue: ReturnType<T> extends Promise<infer U> ? U : never,
  context?: ErrorContext
): T {
  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, context);
      return fallbackValue as ReturnType<T>;
    }
  }) as T;
}

/**
 * Retry async function on failure
 */
export async function retryAsync<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    delay?: number;
    backoff?: number;
    onRetry?: (attempt: number, error: Error) => void;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    delay = 1000,
    backoff = 2,
    onRetry,
  } = options;

  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === maxRetries) {
        break;
      }

      if (onRetry) {
        onRetry(attempt, lastError);
      }

      const waitTime = delay * Math.pow(backoff, attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  throw lastError!;
}

/**
 * Safe JSON parse with error handling
 */
export function safeJsonParse<T>(
  json: string,
  fallback: T
): T {
  try {
    return JSON.parse(json) as T;
  } catch (error) {
    console.warn('Failed to parse JSON:', error);
    return fallback;
  }
}

/**
 * Safe async function execution
 */
export async function safeAsync<T>(
  fn: () => Promise<T>,
  fallback: T,
  context?: ErrorContext
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    logError(
      error instanceof Error ? error : new Error(String(error)),
      context
    );
    return fallback;
  }
}
