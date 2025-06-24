/**
 * Database Context Provider
 * 
 * This provider manages the database connection and provides it to the React component tree.
 * It handles initialization, configuration, and provider switching.
 */

import React, { createContext, useEffect, useState, useCallback } from 'react'
import type { 
  IDatabaseProvider, 
  DatabaseConfig, 
  DatabaseProvider,
  DatabaseChangeListener,
  DatabaseHookResult,
  DatabaseState,
  ProviderConfig
} from '@/types/database'
import { DatabaseError } from '@/types/database'
import { DatabaseFactory } from './factories/database-factory'

// Create the context
export const DatabaseContext = createContext<DatabaseHookResult | undefined>(undefined)

interface DatabaseProviderProps {
  children: React.ReactNode
  defaultConfig?: DatabaseConfig
}

export function DatabaseProvider({ children, defaultConfig }: DatabaseProviderProps) {
  const [provider, setProvider] = useState<IDatabaseProvider | null>(null)
  const [config, setConfig] = useState<DatabaseConfig | null>(null)
  const [state, setState] = useState<DatabaseState>({
    isConnected: false,
    isInitializing: false,
    currentProvider: null,
    lastError: null,
    syncStatus: 'idle',
    lastSyncAt: null
  })
  
  const [factory] = useState(() => DatabaseFactory.getInstance())

  // Initialize database on mount
  useEffect(() => {
    initializeDatabase()
    
    // Cleanup on unmount
    return () => {
      factory.close().catch(console.error)
    }
  }, [])

  const initializeDatabase = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isInitializing: true, lastError: null }))
      
      const configToUse = defaultConfig || factory.getDefaultConfig()
      
      // Validate configuration
      const validation = factory.validateConfig(configToUse)
      if (!validation.isValid) {
        throw new DatabaseError(
          `Invalid database configuration: ${validation.errors.join(', ')}`,
          'INVALID_CONFIG',
          configToUse.provider
        )
      }
      
      const newProvider = await factory.createProvider(configToUse)
      
      setProvider(newProvider)
      setConfig(configToUse)
      setState(prev => ({
        ...prev,
        isConnected: true,
        isInitializing: false,
        currentProvider: configToUse.provider,
        lastError: null
      }))
      
      console.log('✅ Database context initialized successfully')
    } catch (err) {
      const error = err instanceof DatabaseError 
        ? err 
        : new DatabaseError(
            'Failed to initialize database',
            'CONNECTION_FAILED',
            defaultConfig?.provider || 'dexie'
          )
      
      setState(prev => ({
        ...prev,
        isConnected: false,
        isInitializing: false,
        lastError: error
      }))
      
      console.error('❌ Database initialization failed:', error)
    }
  }, [defaultConfig, factory])

  const switchProvider = useCallback(async (
    newProvider: DatabaseProvider, 
    options?: ProviderConfig
  ) => {
    try {
      setState(prev => ({ ...prev, isInitializing: true, lastError: null }))
      
      const newConfig: DatabaseConfig = {
        provider: newProvider,
        options: options || {}
      }
      
      // Validate new configuration
      const validation = factory.validateConfig(newConfig)
      if (!validation.isValid) {
        throw new DatabaseError(
          `Invalid database configuration: ${validation.errors.join(', ')}`,
          'INVALID_CONFIG',
          newProvider
        )
      }
      
      const newProviderInstance = await factory.switchProvider(newConfig)
      
      setProvider(newProviderInstance)
      setConfig(newConfig)
      setState(prev => ({
        ...prev,
        isConnected: true,
        isInitializing: false,
        currentProvider: newProvider,
        lastError: null
      }))
      
      console.log(`✅ Successfully switched to '${newProvider}' provider`)
    } catch (err) {
      const error = err instanceof DatabaseError 
        ? err 
        : new DatabaseError(
            'Failed to switch database provider',
            'SYNC_FAILED',
            newProvider
          )
      
      setState(prev => ({
        ...prev,
        isInitializing: false,
        lastError: error
      }))
      
      console.error('❌ Provider switch failed:', error)
    }
  }, [factory])

  const reconnect = useCallback(async () => {
    if (config) {
      await initializeDatabase()
    }
  }, [config, initializeDatabase])

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, lastError: null }))
  }, [])

  const contextValue: DatabaseHookResult = {
    state,
    provider,
    switchProvider,
    reconnect,
    clearError
  }

  return (
    <DatabaseContext.Provider value={contextValue}>
      {children}
    </DatabaseContext.Provider>
  )
}