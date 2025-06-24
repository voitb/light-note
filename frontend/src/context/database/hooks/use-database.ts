/**
 * Database Context Hook
 * 
 * Main hook for accessing the database context and provider.
 * Provides database instance, configuration, and provider management.
 */

import { useContext, useState, useCallback, useEffect } from 'react'
import type { 
  IDatabaseProvider, 
  DatabaseConfig, 
  DatabaseProvider,
  DatabaseChangeListener,
  DatabaseHookResult,
  EventSubscriptionOptions,
  ProviderInfo
} from '@/types/database'
import { DatabaseError, ERROR_CODES } from '@/types/database'
import { DatabaseContext } from '../database-provider'

/**
 * Hook to use database context
 * @throws Error if used outside DatabaseProvider
 */
export function useDatabase(): DatabaseHookResult {
  const context = useContext(DatabaseContext)
  
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider')
  }
  
  return context
}

/**
 * Hook to get database instance (throws if not initialized)
 * @throws Error if database not initialized or error occurred
 */
export function useDatabaseInstance(): IDatabaseProvider {
  const { state, provider } = useDatabase()
  
  if (state.lastError) {
    throw new Error(`Database error: ${state.lastError.message}`)
  }
  
  if (!state.isConnected || !provider) {
    throw new Error('Database not connected')
  }
  
  return provider
}

/**
 * Hook for database operations with loading states and error handling
 */
export function useDatabaseOperation<T>() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<DatabaseError | null>(null)
  const database = useDatabaseInstance()

  const execute = useCallback(async (
    operation: (db: IDatabaseProvider) => Promise<T>
  ): Promise<T | null> => {
    try {
      setIsLoading(true)
      setError(null)
      
      const result = await operation(database)
      return result
    } catch (err) {
      const dbError = err instanceof DatabaseError 
        ? err 
        : new DatabaseError(
            err instanceof Error ? err.message : 'Database operation failed',
            ERROR_CODES.UNKNOWN_ERROR,
            database.getInfo().config.provider,
            {
              originalError: err instanceof Error ? err : undefined,
              context: { operation: 'useDatabaseOperation' }
            }
          )
      
      setError(dbError)
      console.error('Database operation error:', dbError)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [database])

  const executeWithRetry = useCallback(async (
    operation: (db: IDatabaseProvider) => Promise<T>,
    maxRetries = 3,
    retryDelay = 1000
  ): Promise<T | null> => {
    let lastError: DatabaseError | null = null
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        setIsLoading(true)
        setError(null)
        
        const result = await operation(database)
        return result
      } catch (err) {
        const dbError = err instanceof DatabaseError 
          ? err 
          : new DatabaseError(
              err instanceof Error ? err.message : 'Database operation failed',
              ERROR_CODES.UNKNOWN_ERROR,
              database.getInfo().config.provider,
              {
                originalError: err instanceof Error ? err : undefined,
                context: { operation: 'useDatabaseOperation', attempt }
              }
            )
        
        lastError = dbError
        
        // Don't retry if error is not retryable
        if (!dbError.isRetryable || attempt === maxRetries) {
          break
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempt))
      }
    }
    
    setError(lastError)
    setIsLoading(false)
    return null
  }, [database])

  return {
    execute,
    executeWithRetry,
    isLoading,
    error,
    clearError: () => setError(null)
  }
}

/**
 * Hook for subscribing to database changes
 */
export function useDatabaseChanges(
  listener: DatabaseChangeListener,
  options?: EventSubscriptionOptions
) {
  const database = useDatabaseInstance()
  
  useEffect(() => {
    if ('subscribeToChanges' in database && typeof database.subscribeToChanges === 'function') {
      return (database as any).subscribeToChanges(listener)
    }
    
    return () => {}
  }, [database, listener])
}

/**
 * Hook for database status monitoring
 */
export function useDatabaseStatus() {
  const { state, provider } = useDatabase()
  const [providerInfo, setProviderInfo] = useState<ProviderInfo | null>(null)
  
  useEffect(() => {
    if (provider) {
      setProviderInfo(provider.getInfo())
      
      // Update provider info periodically
      const interval = setInterval(() => {
        setProviderInfo(provider.getInfo())
      }, 5000)
      
      return () => clearInterval(interval)
    }
  }, [provider])
  
  return {
    ...state,
    providerInfo,
    isOnline: navigator.onLine,
    lastPing: providerInfo?.connectedAt
  }
}

// Re-export important types for convenience
export type { DatabaseHookResult, DatabaseState } from '@/types/database'