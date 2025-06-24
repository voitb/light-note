/**
 * Database Context - Main Export
 * 
 * This file exports all database-related components in a clean, organized manner
 * following senior-level folder structure patterns.
 */

// Core types (re-exported from types/database)
export type * from '@/types/database'

// Context and Provider
export { DatabaseProvider, DatabaseContext } from './database-provider'

// Hooks
export {
  useDatabase,
  useDatabaseInstance,
  useDatabaseOperation,
  useDatabaseChanges,
  useDatabaseStatus
} from './hooks/use-database'

// Database Factory
export { DatabaseFactory } from './factories/database-factory'

// Database Providers
export { DexieProvider } from './providers/dexie-provider'
// export { SupabaseProvider } from './providers/supabase-provider' // Future

// Convenience exports and defaults
import { DatabaseFactory } from './factories/database-factory'
import type { DatabaseConfig } from '@/types/database'

export const DEFAULT_DATABASE_CONFIG: DatabaseConfig = {
  provider: 'dexie',
  options: {
    databaseName: 'LightNoteDB',
    version: 2,
    enableSync: false,
    enableCache: true,
    enableLogging: import.meta.env.DEV
  }
}

export const SUPPORTED_PROVIDERS = ['dexie'] as const // Will include 'supabase' when implemented

/**
 * Convenience function to get a database instance with default configuration
 */
export async function createDefaultDatabase() {
  const factory = DatabaseFactory.getInstance()
  return await factory.createProvider(DEFAULT_DATABASE_CONFIG)
}

/**
 * Convenience function to check if a provider is currently supported
 */
export function isProviderSupported(provider: string): boolean {
  return SUPPORTED_PROVIDERS.includes(provider as any)
}

/**
 * Get the factory instance (singleton)
 */
export function getDatabaseFactory() {
  return DatabaseFactory.getInstance()
}