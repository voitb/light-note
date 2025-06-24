/**
 * Database Error Types
 * 
 * Comprehensive error handling system for database operations.
 * These types provide structured error information for better debugging and user feedback.
 */

import type { DatabaseProvider } from './providers'

// Error severity levels
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical'

// Error categories
export type ErrorCategory = 
  | 'connection'
  | 'authentication'
  | 'authorization'
  | 'validation'
  | 'not_found'
  | 'conflict'
  | 'timeout'
  | 'network'
  | 'storage'
  | 'sync'
  | 'transaction'
  | 'configuration'
  | 'unknown'

// Error codes for specific error types
export const ERROR_CODES = {
  // Connection errors
  CONNECTION_FAILED: 'CONNECTION_FAILED',
  CONNECTION_TIMEOUT: 'CONNECTION_TIMEOUT',
  CONNECTION_LOST: 'CONNECTION_LOST',
  
  // Authentication errors
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  AUTH_INVALID: 'AUTH_INVALID',
  AUTH_EXPIRED: 'AUTH_EXPIRED',
  
  // Authorization errors
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  ACCESS_FORBIDDEN: 'ACCESS_FORBIDDEN',
  
  // Validation errors
  INVALID_INPUT: 'INVALID_INPUT',
  REQUIRED_FIELD: 'REQUIRED_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',
  VALUE_TOO_LONG: 'VALUE_TOO_LONG',
  VALUE_TOO_SHORT: 'VALUE_TOO_SHORT',
  
  // Not found errors
  RECORD_NOT_FOUND: 'RECORD_NOT_FOUND',
  TABLE_NOT_FOUND: 'TABLE_NOT_FOUND',
  DATABASE_NOT_FOUND: 'DATABASE_NOT_FOUND',
  
  // Conflict errors
  DUPLICATE_KEY: 'DUPLICATE_KEY',
  FOREIGN_KEY_VIOLATION: 'FOREIGN_KEY_VIOLATION',
  CONCURRENT_MODIFICATION: 'CONCURRENT_MODIFICATION',
  
  // Timeout errors
  OPERATION_TIMEOUT: 'OPERATION_TIMEOUT',
  QUERY_TIMEOUT: 'QUERY_TIMEOUT',
  
  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  OFFLINE: 'OFFLINE',
  
  // Storage errors
  STORAGE_FULL: 'STORAGE_FULL',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
  CORRUPTION: 'CORRUPTION',
  
  // Sync errors
  SYNC_CONFLICT: 'SYNC_CONFLICT',
  SYNC_FAILED: 'SYNC_FAILED',
  
  // Transaction errors
  TRANSACTION_FAILED: 'TRANSACTION_FAILED',
  ROLLBACK_FAILED: 'ROLLBACK_FAILED',
  
  // Configuration errors
  INVALID_CONFIG: 'INVALID_CONFIG',
  PROVIDER_NOT_SUPPORTED: 'PROVIDER_NOT_SUPPORTED',
  
  // Unknown errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
} as const

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES]

// Base error context
export interface ErrorContext {
  operation: string
  table?: string
  recordId?: string
  userId?: string
  timestamp: string
  provider: DatabaseProvider
  additionalInfo?: Record<string, unknown>
}

// Error details for user-friendly messages
export interface ErrorDetails {
  userMessage: string
  technicalMessage: string
  suggestedActions: string[]
  documentationUrl?: string
  supportContactInfo?: string
}

// Base database error class
export class DatabaseError extends Error {
  public code: ErrorCode
  public category: ErrorCategory
  public severity: ErrorSeverity
  public provider: DatabaseProvider
  public context: ErrorContext
  public details: ErrorDetails
  public originalError?: Error
  public isRetryable: boolean
  public retryAfterMs?: number

  constructor(
    message: string,
    code: ErrorCode,
    provider: DatabaseProvider,
    options: {
      category?: ErrorCategory
      severity?: ErrorSeverity
      context?: Partial<ErrorContext>
      details?: Partial<ErrorDetails>
      originalError?: Error
      isRetryable?: boolean
      retryAfterMs?: number
    } = {}
  ) {
    super(message)
    this.name = 'DatabaseError'
    this.code = code
    this.category = options.category || this.inferCategory(code)
    this.severity = options.severity || this.inferSeverity(code)
    this.provider = provider
    this.originalError = options.originalError
    this.isRetryable = options.isRetryable ?? this.inferRetryability(code)
    this.retryAfterMs = options.retryAfterMs

    this.context = {
      operation: 'unknown',
      timestamp: new Date().toISOString(),
      provider,
      ...options.context
    }

    this.details = {
      userMessage: message,
      technicalMessage: options.originalError?.message || message,
      suggestedActions: this.getSuggestedActions(code),
      ...options.details
    }
  }

  private inferCategory(code: ErrorCode): ErrorCategory {
    if (code.includes('CONNECTION') || code.includes('NETWORK')) return 'connection'
    if (code.includes('AUTH')) return 'authentication'
    if (code.includes('PERMISSION') || code.includes('ACCESS')) return 'authorization'
    if (code.includes('INVALID') || code.includes('REQUIRED') || code.includes('FORMAT')) return 'validation'
    if (code.includes('NOT_FOUND')) return 'not_found'
    if (code.includes('DUPLICATE') || code.includes('VIOLATION') || code.includes('CONFLICT')) return 'conflict'
    if (code.includes('TIMEOUT')) return 'timeout'
    if (code.includes('STORAGE') || code.includes('QUOTA')) return 'storage'
    if (code.includes('SYNC')) return 'sync'
    if (code.includes('TRANSACTION')) return 'transaction'
    if (code.includes('CONFIG')) return 'configuration'
    return 'unknown'
  }

  private inferSeverity(code: ErrorCode): ErrorSeverity {
    const criticalCodes = ['CORRUPTION', 'STORAGE_FULL', 'CONNECTION_FAILED']
    const highCodes = ['AUTH_INVALID', 'PERMISSION_DENIED', 'SYNC_FAILED']
    const lowCodes = ['RECORD_NOT_FOUND', 'INVALID_INPUT']

    if (criticalCodes.includes(code)) return 'critical'
    if (highCodes.includes(code)) return 'high'
    if (lowCodes.includes(code)) return 'low'
    return 'medium'
  }

  private inferRetryability(code: ErrorCode): boolean {
    const nonRetryableCodes = [
      'AUTH_INVALID', 'PERMISSION_DENIED', 'INVALID_INPUT', 'REQUIRED_FIELD',
      'INVALID_FORMAT', 'DUPLICATE_KEY', 'RECORD_NOT_FOUND'
    ]
    return !nonRetryableCodes.includes(code)
  }

  private getSuggestedActions(code: ErrorCode): string[] {
    const actionMap: Record<ErrorCode, string[]> = {
      [ERROR_CODES.CONNECTION_FAILED]: [
        'Check your internet connection',
        'Verify the database server is running',
        'Check firewall settings'
      ],
      [ERROR_CODES.AUTH_INVALID]: [
        'Check your credentials',
        'Verify your authentication token is valid',
        'Try logging in again'
      ],
      [ERROR_CODES.RECORD_NOT_FOUND]: [
        'Verify the record ID is correct',
        'Check if the record was deleted',
        'Refresh your data'
      ],
      [ERROR_CODES.STORAGE_FULL]: [
        'Free up storage space',
        'Delete unnecessary files',
        'Contact your administrator'
      ],
      [ERROR_CODES.INVALID_INPUT]: [
        'Check your input data',
        'Verify required fields are filled',
        'Check data format requirements'
      ]
    }

    return actionMap[code] || ['Try again later', 'Contact support if the problem persists']
  }

  // Convert to plain object for serialization
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      category: this.category,
      severity: this.severity,
      provider: this.provider,
      context: this.context,
      details: this.details,
      isRetryable: this.isRetryable,
      retryAfterMs: this.retryAfterMs,
      stack: this.stack
    }
  }
}

// Specific error types for common scenarios
export class NotFoundError extends DatabaseError {
  constructor(resource: string, id: string, provider: DatabaseProvider, context?: Partial<ErrorContext>) {
    super(
      `${resource} with id ${id} not found`,
      ERROR_CODES.RECORD_NOT_FOUND,
      provider,
      {
        category: 'not_found',
        severity: 'low',
        context: { ...context, recordId: id },
        isRetryable: false
      }
    )
    this.name = 'NotFoundError'
  }
}

export class ValidationError extends DatabaseError {
  public field?: string

  constructor(
    message: string, 
    provider: DatabaseProvider, 
    field?: string, 
    context?: Partial<ErrorContext>
  ) {
    super(
      message,
      ERROR_CODES.INVALID_INPUT,
      provider,
      {
        category: 'validation',
        severity: 'low',
        context,
        isRetryable: false
      }
    )
    this.name = 'ValidationError'
    this.field = field
  }
}

export class ConnectionError extends DatabaseError {
  constructor(message: string, provider: DatabaseProvider, originalError?: Error) {
    super(
      message,
      ERROR_CODES.CONNECTION_FAILED,
      provider,
      {
        category: 'connection',
        severity: 'high',
        originalError,
        isRetryable: true,
        retryAfterMs: 5000
      }
    )
    this.name = 'ConnectionError'
  }
}

export class SyncError extends DatabaseError {
  public conflictData?: unknown

  constructor(
    message: string, 
    provider: DatabaseProvider, 
    conflictData?: unknown,
    context?: Partial<ErrorContext>
  ) {
    super(
      message,
      ERROR_CODES.SYNC_CONFLICT,
      provider,
      {
        category: 'sync',
        severity: 'medium',
        context,
        isRetryable: true
      }
    )
    this.name = 'SyncError'
    this.conflictData = conflictData
  }
}

export class TransactionError extends DatabaseError {
  constructor(message: string, provider: DatabaseProvider, originalError?: Error) {
    super(
      message,
      ERROR_CODES.TRANSACTION_FAILED,
      provider,
      {
        category: 'transaction',
        severity: 'medium',
        originalError,
        isRetryable: true
      }
    )
    this.name = 'TransactionError'
  }
}

// Error handler interface
export interface IErrorHandler {
  handle(error: DatabaseError): Promise<void>
  shouldRetry(error: DatabaseError): boolean
  getRetryDelay(error: DatabaseError, attempt: number): number
}

// Error reporting interface
export interface IErrorReporter {
  report(error: DatabaseError): Promise<void>
  setContext(context: Partial<ErrorContext>): void
  setUser(userId: string): void
}

// Error recovery strategies
export interface ErrorRecoveryStrategy {
  canHandle(error: DatabaseError): boolean
  recover(error: DatabaseError): Promise<boolean>
  name: string
  priority: number
}

// Error aggregation for batch operations
export interface BatchErrorResult {
  successful: number
  failed: number
  errors: DatabaseError[]
  partialSuccess: boolean
}

// Type guards for error checking
export function isDatabaseError(error: unknown): error is DatabaseError {
  return error instanceof DatabaseError
}

export function isRetryableError(error: unknown): boolean {
  return isDatabaseError(error) && error.isRetryable
}

export function isCriticalError(error: unknown): boolean {
  return isDatabaseError(error) && error.severity === 'critical'
}

export function isNetworkError(error: unknown): boolean {
  return isDatabaseError(error) && error.category === 'network'
}

export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError
}

export function isNotFoundError(error: unknown): error is NotFoundError {
  return error instanceof NotFoundError
}