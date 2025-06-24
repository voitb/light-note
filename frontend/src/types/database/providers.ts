/**
 * Database Provider Types
 * 
 * Interfaces and types for database provider implementations.
 * These define the contract that all database providers must follow.
 */

import type { 
  Note, 
  Folder, 
  RecentNote, 
  CreateNoteInput, 
  UpdateNoteInput, 
  CreateFolderInput, 
  UpdateFolderInput 
} from './entities'
import type { 
  NoteFilters, 
  FolderFilters, 
  RecentNotesFilters,
  QueryResult 
} from './filters'
import type { DatabaseChangeEvent, DatabaseChangeListener } from './events'

// Supported database providers
export type DatabaseProvider = 'dexie' | 'supabase'

// Provider configuration
export interface BaseProviderConfig {
  enableSync?: boolean
  syncInterval?: number
  enableCache?: boolean
  cacheSize?: number
  enableLogging?: boolean
  logLevel?: 'debug' | 'info' | 'warn' | 'error'
}

// Dexie-specific configuration
export interface DexieProviderConfig extends BaseProviderConfig {
  databaseName?: string
  version?: number
  clearOnVersionChange?: boolean
  enableCompression?: boolean
}

// Supabase-specific configuration
export interface SupabaseProviderConfig extends BaseProviderConfig {
  url?: string
  anonKey?: string
  serviceKey?: string
  enableRealtime?: boolean
  realtimeChannels?: string[]
  schema?: string
}

// Union type for all provider configs
export type ProviderConfig = DexieProviderConfig | SupabaseProviderConfig

// Database configuration
export interface DatabaseConfig {
  provider: DatabaseProvider
  options?: ProviderConfig
}

// Provider capability flags
export interface ProviderCapabilities {
  supportsRealtime: boolean
  supportsBulkOperations: boolean
  supportsTransactions: boolean
  supportsFullTextSearch: boolean
  supportsRelations: boolean
  supportsIndexes: boolean
  supportsBackup: boolean
  supportsEncryption: boolean
  maxConcurrentConnections: number
  maxRecordSize: number // in bytes
}

// Provider status
export type ProviderStatus = 
  | 'initializing'
  | 'connected'
  | 'disconnected'
  | 'error'
  | 'syncing'
  | 'offline'

// Provider info
export interface ProviderInfo {
  name: string
  version: string
  status: ProviderStatus
  capabilities: ProviderCapabilities
  config: DatabaseConfig
  connectedAt?: string
  lastSync?: string
  errorMessage?: string
}

// Main database provider interface
export interface IDatabaseProvider {
  // Provider information
  getInfo(): ProviderInfo
  
  // Lifecycle
  initialize(): Promise<void>
  close(): Promise<void>
  isConnected(): boolean
  
  // Health check
  ping(): Promise<boolean>
  getStatus(): ProviderStatus
  
  // Notes operations
  createNote(note: CreateNoteInput): Promise<Note>
  getNote(id: string): Promise<Note | null>
  getNotes(filters?: NoteFilters): Promise<Note[]>
  getNotesWithMetadata(filters?: NoteFilters): Promise<QueryResult<Note>>
  updateNote(id: string, updates: UpdateNoteInput): Promise<Note>
  deleteNote(id: string): Promise<void>
  
  // Folders operations
  createFolder(folder: CreateFolderInput): Promise<Folder>
  getFolder(id: string): Promise<Folder | null>
  getFolders(filters?: FolderFilters): Promise<Folder[]>
  getFoldersWithMetadata(filters?: FolderFilters): Promise<QueryResult<Folder>>
  updateFolder(id: string, updates: UpdateFolderInput): Promise<Folder>
  deleteFolder(id: string): Promise<void>
  
  // Recent notes operations
  addRecentNote(note: Note, userId: string): Promise<void>
  getRecentNotes(userId: string, limit?: number): Promise<RecentNote[]>
  getRecentNotesWithMetadata(filters: RecentNotesFilters): Promise<QueryResult<RecentNote>>
  clearRecentNotes(userId: string): Promise<void>
  
  // Bulk operations
  bulkCreateNotes(notes: CreateNoteInput[]): Promise<Note[]>
  bulkUpdateNotes(updates: Array<{ id: string; updates: UpdateNoteInput }>): Promise<Note[]>
  bulkDeleteNotes(ids: string[]): Promise<void>
  
  bulkCreateFolders(folders: CreateFolderInput[]): Promise<Folder[]>
  bulkUpdateFolders(updates: Array<{ id: string; updates: UpdateFolderInput }>): Promise<Folder[]>
  bulkDeleteFolders(ids: string[]): Promise<void>
  
  // Utility operations
  count(table: 'notes' | 'folders', filters?: NoteFilters | FolderFilters): Promise<number>
  exists(table: 'notes' | 'folders', id: string): Promise<boolean>
  
  // Search operations
  searchNotes(query: string, userId: string, options?: {
    includeContent?: boolean
    includeTags?: boolean
    limit?: number
  }): Promise<Note[]>
  
  // Transaction support (if supported by provider)
  transaction<T>(callback: (tx: ITransactionContext) => Promise<T>): Promise<T>
  
  // Sync operations (for cloud providers)
  getLastSyncTimestamp(): Promise<string | null>
  setLastSyncTimestamp(timestamp: string): Promise<void>
  sync(): Promise<SyncResult>
  
  // Real-time subscriptions (if supported)
  subscribeToChanges?(listener: DatabaseChangeListener): () => void
  
  // Backup and restore
  exportData?(userId?: string): Promise<DatabaseBackup>
  importData?(backup: DatabaseBackup): Promise<ImportResult>
  
  // Cache management
  clearCache?(): Promise<void>
  getCacheSize?(): Promise<number>
}

// Transaction context interface
export interface ITransactionContext {
  createNote(note: CreateNoteInput): Promise<Note>
  updateNote(id: string, updates: UpdateNoteInput): Promise<Note>
  deleteNote(id: string): Promise<void>
  
  createFolder(folder: CreateFolderInput): Promise<Folder>
  updateFolder(id: string, updates: UpdateFolderInput): Promise<Folder>
  deleteFolder(id: string): Promise<void>
  
  rollback(): Promise<void>
  commit(): Promise<void>
}

// Sync result
export interface SyncResult {
  success: boolean
  syncedAt: string
  changes: {
    notes: { created: number; updated: number; deleted: number }
    folders: { created: number; updated: number; deleted: number }
  }
  conflicts?: SyncConflict[]
  errors?: string[]
}

// Sync conflict
export interface SyncConflict {
  id: string
  table: 'notes' | 'folders'
  type: 'update_conflict' | 'delete_conflict'
  localData: Note | Folder
  remoteData: Note | Folder
  resolution?: 'local' | 'remote' | 'merge'
}

// Database backup
export interface DatabaseBackup {
  version: string
  createdAt: string
  userId?: string
  data: {
    notes: Note[]
    folders: Folder[]
    recentNotes: RecentNote[]
  }
  metadata: {
    totalNotes: number
    totalFolders: number
    backupSize: number // in bytes
  }
}

// Import result
export interface ImportResult {
  success: boolean
  importedAt: string
  imported: {
    notes: number
    folders: number
    recentNotes: number
  }
  skipped: {
    notes: number
    folders: number
    recentNotes: number
  }
  errors?: string[]
}

// Provider factory interface
export interface IProviderFactory {
  createProvider(config: DatabaseConfig): Promise<IDatabaseProvider>
  getSupportedProviders(): DatabaseProvider[]
  isProviderSupported(provider: DatabaseProvider): boolean
  validateConfig(config: DatabaseConfig): { isValid: boolean; errors: string[] }
}