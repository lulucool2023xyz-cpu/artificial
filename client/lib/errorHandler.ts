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
 * Friendly greeting messages pool for randomization
 */
const FRIENDLY_GREETINGS = [
  'Halo teman-teman SMPN 4 Margahayu! 👋',
  'Hey sobat SMPN 4 Margahayu! ✨',
  'Hi teman-teman! 🌟',
  'Halo gaes! 👋',
  'Hai teman-teman kece! 💫',
];

function getRandomGreeting(): string {
  return FRIENDLY_GREETINGS[Math.floor(Math.random() * FRIENDLY_GREETINGS.length)];
}

/**
 * Handle error and show user-friendly toast notification
 * Technical details are only logged to console, never shown to users
 */
export function handleError(
  error: Error | AppError | unknown,
  context?: ErrorContext
): void {
  let errorMessage = 'Oops, ada yang kurang beres nih! 😅 Tenang, coba refresh halaman ya!';
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
    errorMessage = `${getRandomGreeting()} Ada sedikit gangguan nih, coba lagi ya! 😊`;
    console.error('🔴 Error:', error);
  } else {
    console.error('🔴 Unknown error:', error);
  }

  // Show toast notification with friendly title
  toast({
    variant: "destructive",
    title: "Pemberitahuan",
    description: errorMessage,
    duration: 5000,
  });
}

/**
 * Convert technical errors to user-friendly messages
 * These messages are warm and friendly for SMPN 4 Margahayu students
 * Important: Technical details are NEVER exposed to users
 */
export function getUserFriendlyMessage(error: Error): string {
  const message = error.message.toLowerCase();
  const greeting = getRandomGreeting();

  // Network errors
  if (message.includes('network') || message.includes('fetch failed') || message.includes('err_connection')) {
    return `${greeting} Koneksi internet lagi gangguan nih, coba cek WiFi kamu dan coba lagi ya! 📶`;
  }
  if (message.includes('timeout')) {
    return `${greeting} Waduh agak lama nih prosesnya, sabar ya! Coba lagi dalam beberapa detik 🕐`;
  }
  if (message.includes('chunklloaderror') || message.includes('loading chunk')) {
    return `${greeting} Halaman perlu di-refresh nih! Klik refresh atau tekan F5 ya 🔄`;
  }

  // Authentication errors
  if (message.includes('unauthorized') || message.includes('401')) {
    return `${greeting} Yuk login dulu biar bisa akses fitur keren ini! 🔐`;
  }
  if (message.includes('forbidden') || message.includes('403')) {
    return `${greeting} Fitur ini belum bisa diakses nih, mungkin perlu upgrade akun dulu ya! 🔒`;
  }

  // Not found errors
  if (message.includes('not found') || message.includes('404')) {
    return `${greeting} Halaman yang dicari nggak ketemu nih, coba balik ke halaman utama ya! 🔍`;
  }

  // Server errors
  if (message.includes('500') || message.includes('internal server') || message.includes('server error')) {
    return `${greeting} Servernya lagi istirahat sebentar! 😴 Tunggu beberapa menit lalu coba lagi ya!`;
  }

  // Rate limit / API errors (hide API key details!)
  if (message.includes('rate limit') || message.includes('too many') || message.includes('429')) {
    return `${greeting} Lagi rame banget nih! 🎉 Sabar ya, coba lagi beberapa menit lagi!`;
  }
  if (message.includes('api key') || message.includes('api_key') || message.includes('quota') || message.includes('billing')) {
    return `${greeting} Fitur ini lagi kami maintenance dulu ya! 🔧 Nanti balik lagi kok!`;
  }

  // Bad request / Validation errors
  if (message.includes('validation') || message.includes('invalid') || message.includes('400')) {
    return `${greeting} Hmm, ada yang kurang tepat nih inputnya. Coba cek lagi ya! ✏️`;
  }

  // Service unavailable
  if (message.includes('503') || message.includes('unavailable')) {
    return `${greeting} Layanannya lagi di-update nih! 🚀 Bentar lagi selesai kok, sabar ya!`;
  }

  // Default message - never show technical details
  return `${greeting} Ada sedikit gangguan, tapi tenang aja! 😊 Coba refresh atau coba lagi nanti ya!`;
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
