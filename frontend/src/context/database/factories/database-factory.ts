/**
 * Database Factory
 * 
 * This factory creates and manages database provider instances.
 * It handles switching between different providers (Dexie, Supabase) and configuration.
 */

import type { 
  IDatabaseProvider, 
  DatabaseConfig, 
  DatabaseProvider, 
  IProviderFactory,
  ProviderInfo,
  DexieProviderConfig,
  SupabaseProviderConfig
} from '@/types/database'
import { DatabaseError, ERROR_CODES } from '@/types/database'
import { DexieProvider } from '../providers/dexie-provider'

// Future imports (will be added when Supabase provider is implemented)
// import { SupabaseProvider } from '../providers/supabase-provider'

export class DatabaseFactory implements IProviderFactory {
  private static instance: DatabaseFactory | null = null
  private currentProvider: IDatabaseProvider | null = null
  private currentConfig: DatabaseConfig | null = null
  private migrationInProgress = false

  private constructor() {}

  /**
   * Get singleton instance of DatabaseFactory
   */
  static getInstance(): DatabaseFactory {
    if (!this.instance) {
      this.instance = new DatabaseFactory()
    }
    return this.instance
  }

  /**
   * Create a database provider based on configuration
   */
  async createProvider(config: DatabaseConfig): Promise<IDatabaseProvider> {
    // Validate configuration first
    const validation = this.validateConfig(config)
    if (!validation.isValid) {
      throw new DatabaseError(
        `Invalid configuration: ${validation.errors.join(', ')}`,
        ERROR_CODES.INVALID_CONFIG,
        config.provider,
        {
          category: 'configuration',
          severity: 'high',
          context: { operation: 'createProvider' },
          isRetryable: false
        }
      )
    }

    // Close existing provider if switching
    if (this.currentProvider && this.currentConfig?.provider !== config.provider) {
      await this.closeCurrentProvider()
    }

    // Return existing provider if same configuration
    if (this.currentProvider && this.isSameConfig(this.currentConfig, config)) {
      return this.currentProvider
    }

    let provider: IDatabaseProvider

    try {
      switch (config.provider) {
        case 'dexie':
          provider = new DexieProvider(
            (config.options as DexieProviderConfig)?.databaseName || 'LightNoteDB',
            config.options as DexieProviderConfig
          )
          break
          
        case 'supabase':
          // Future implementation
          throw new DatabaseError(
            'Supabase provider not yet implemented. Use Dexie provider for now.',
            ERROR_CODES.PROVIDER_NOT_SUPPORTED,
            config.provider,
            {
              category: 'configuration',
              severity: 'medium',
              context: { operation: 'createProvider' },
              isRetryable: false,
              details: {
                userMessage: 'Supabase integration is coming soon. Please use local storage for now.',
                suggestedActions: ['Use "dexie" as the provider', 'Check back for updates']
              }
            }
          )
          // provider = new SupabaseProvider({
          //   url: config.options?.url || process.env.VITE_SUPABASE_URL!,
          //   anonKey: config.options?.anonKey || process.env.VITE_SUPABASE_ANON_KEY!,
          //   ...config.options
          // })
          // break
          
        default:
          throw new DatabaseError(
            `Unsupported database provider: ${config.provider}`,
            ERROR_CODES.PROVIDER_NOT_SUPPORTED,
            config.provider as DatabaseProvider,
            {
              category: 'configuration',
              severity: 'high',
              context: { operation: 'createProvider' },
              isRetryable: false
            }
          )
      }

      await provider.initialize()
      
      this.currentProvider = provider
      this.currentConfig = { ...config }
      
      console.log(`✅ Database provider '${config.provider}' initialized successfully`)
      return provider

    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error
      }
      
      throw new DatabaseError(
        `Failed to create ${config.provider} provider: ${error instanceof Error ? error.message : 'Unknown error'}`,
        ERROR_CODES.CONNECTION_FAILED,
        config.provider,
        {
          category: 'connection',
          severity: 'high',
          originalError: error instanceof Error ? error : undefined,
          context: { operation: 'createProvider' },
          isRetryable: true
        }
      )
    }
  }

  /**
   * Get current active provider
   */
  getCurrentProvider(): IDatabaseProvider | null {
    return this.currentProvider
  }

  /**
   * Get current configuration
   */
  getCurrentConfig(): DatabaseConfig | null {
    return this.currentConfig ? { ...this.currentConfig } : null
  }

  /**
   * Get current provider info
   */
  getCurrentProviderInfo(): ProviderInfo | null {
    return this.currentProvider?.getInfo() || null
  }

  /**
   * Switch database provider
   */
  async switchProvider(newConfig: DatabaseConfig): Promise<IDatabaseProvider> {
    if (this.migrationInProgress) {
      throw new DatabaseError(
        'Provider switch already in progress',
        ERROR_CODES.CONCURRENT_MODIFICATION,
        newConfig.provider,
        {
          category: 'configuration',
          severity: 'medium',
          context: { operation: 'switchProvider' },
          isRetryable: true,
          retryAfterMs: 1000
        }
      )
    }

    this.migrationInProgress = true

    try {
      console.log(`🔄 Switching database provider from '${this.currentConfig?.provider || 'none'}' to '${newConfig.provider}'`)
      
      // Store reference to old provider for potential data migration
      const oldProvider = this.currentProvider
      const oldConfig = this.currentConfig

      // Create new provider
      const newProvider = await this.createProvider(newConfig)
      
      // If switching from one provider to another, you might want to migrate data
      if (oldProvider && oldConfig && oldConfig.provider !== newConfig.provider) {
        await this.migrateData(oldProvider, newProvider, oldConfig, newConfig)
      }
      
      // Close old provider after successful migration
      if (oldProvider && oldProvider !== newProvider) {
        try {
          await oldProvider.close()
        } catch (error) {
          console.warn('Failed to close old provider:', error)
        }
      }
      
      console.log(`✅ Successfully switched to '${newConfig.provider}' provider`)
      return newProvider

    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error
      }
      
      throw new DatabaseError(
        `Failed to switch to ${newConfig.provider} provider: ${error instanceof Error ? error.message : 'Unknown error'}`,
        ERROR_CODES.SYNC_FAILED,
        newConfig.provider,
        {
          category: 'sync',
          severity: 'high',
          originalError: error instanceof Error ? error : undefined,
          context: { operation: 'switchProvider' },
          isRetryable: true
        }
      )
    } finally {
      this.migrationInProgress = false
    }
  }

  /**
   * Close current provider and cleanup
   */
  async close(): Promise<void> {
    await this.closeCurrentProvider()
    console.log('🔒 Database factory closed')
  }

  /**
   * Check if a provider is available/supported
   */
  isProviderSupported(provider: DatabaseProvider): boolean {
    switch (provider) {
      case 'dexie':
        return true
      case 'supabase':
        return false // Will be true when implemented
      default:
        return false
    }
  }

  /**
   * Get list of supported providers
   */
  getSupportedProviders(): DatabaseProvider[] {
    return ['dexie'] // Will include 'supabase' when implemented
  }

  /**
   * Get default configuration based on environment
   */
  getDefaultConfig(): DatabaseConfig {
    // In development or if no environment variables are set, use Dexie
    // In production with proper Supabase config, could default to Supabase
    
    const isDevelopment = import.meta.env.DEV
    const hasSupabaseConfig = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY

    if (!isDevelopment && hasSupabaseConfig) {
      return {
        provider: 'supabase',
        options: {
          url: import.meta.env.VITE_SUPABASE_URL,
          anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          enableRealtime: true,
          enableSync: true
        }
      }
    }

    return {
      provider: 'dexie',
      options: {
        databaseName: 'LightNoteDB',
        version: 2,
        enableSync: false,
        enableCache: true,
        enableLogging: isDevelopment
      }
    }
  }

  /**
   * Validate database configuration
   */
  validateConfig(config: DatabaseConfig): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!config) {
      errors.push('Configuration is required')
      return { isValid: false, errors }
    }

    if (!config.provider) {
      errors.push('Provider is required')
    } else if (!this.isProviderSupported(config.provider)) {
      errors.push(`Provider '${config.provider}' is not supported`)
    }

    // Provider-specific validation
    if (config.provider === 'dexie') {
      const dexieOptions = config.options as DexieProviderConfig
      if (dexieOptions?.version && dexieOptions.version < 1) {
        errors.push('Database version must be >= 1')
      }
      if (dexieOptions?.databaseName && dexieOptions.databaseName.length === 0) {
        errors.push('Database name cannot be empty')
      }
    }

    if (config.provider === 'supabase') {
      const supabaseOptions = config.options as SupabaseProviderConfig
      if (!supabaseOptions?.url && !import.meta.env.VITE_SUPABASE_URL) {
        errors.push('Supabase URL is required')
      }
      if (!supabaseOptions?.anonKey && !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        errors.push('Supabase anonymous key is required')
      }
      
      // Validate URL format
      const url = supabaseOptions?.url || import.meta.env.VITE_SUPABASE_URL
      if (url && !url.startsWith('https://')) {
        errors.push('Supabase URL must use HTTPS')
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Get provider capabilities
   */
  getProviderCapabilities(provider: DatabaseProvider) {
    switch (provider) {
      case 'dexie':
        return {
          supportsRealtime: true, // Through event system
          supportsBulkOperations: true,
          supportsTransactions: true,
          supportsFullTextSearch: false, // Limited
          supportsRelations: false,
          supportsIndexes: true,
          supportsBackup: true,
          supportsEncryption: false,
          maxConcurrentConnections: 1,
          maxRecordSize: 1024 * 1024 * 10 // 10MB
        }
      case 'supabase':
        return {
          supportsRealtime: true,
          supportsBulkOperations: true,
          supportsTransactions: true,
          supportsFullTextSearch: true,
          supportsRelations: true,
          supportsIndexes: true,
          supportsBackup: true,
          supportsEncryption: true,
          maxConcurrentConnections: 100,
          maxRecordSize: 1024 * 1024 * 50 // 50MB
        }
      default:
        return null
    }
  }

  // Private helper methods
  private async closeCurrentProvider(): Promise<void> {
    if (this.currentProvider) {
      try {
        await this.currentProvider.close()
      } catch (error) {
        console.warn('Error closing current provider:', error)
      }
      this.currentProvider = null
      this.currentConfig = null
    }
  }

  private isSameConfig(config1: DatabaseConfig | null, config2: DatabaseConfig): boolean {
    if (!config1) return false
    
    return (
      config1.provider === config2.provider &&
      JSON.stringify(config1.options || {}) === JSON.stringify(config2.options || {})
    )
  }

  private async migrateData(
    _fromProvider: IDatabaseProvider,
    _toProvider: IDatabaseProvider,
    fromConfig: DatabaseConfig,
    toConfig: DatabaseConfig
  ): Promise<void> {
    console.log(`🔄 Migrating data from ${fromConfig.provider} to ${toConfig.provider}`)
    
    try {
      // This is a placeholder for future data migration logic
      // For now, we just log a warning about potential data loss
      console.warn('⚠️  Data migration not implemented yet. Data may not be transferred between providers.')
      
      // Future implementation would:
      // 1. Export data from _fromProvider
      // 2. Transform data if needed
      // 3. Import data to _toProvider
      // 4. Verify integrity
      // 5. Handle conflicts
      
    } catch (error) {
      throw new DatabaseError(
        `Data migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        ERROR_CODES.SYNC_FAILED,
        toConfig.provider,
        {
          category: 'sync',
          severity: 'high',
          originalError: error instanceof Error ? error : undefined,
          context: { operation: 'migrateData' },
          isRetryable: false
        }
      )
    }
  }
}