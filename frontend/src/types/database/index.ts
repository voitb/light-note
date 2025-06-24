/**
 * Database Types Index
 * 
 * Central export file for all database-related types.
 * This provides a clean interface for importing database types throughout the application.
 */

// Entity types
export type {
  Note,
  Folder,
  RecentNote,
  CreateNoteInput,
  UpdateNoteInput,
  CreateFolderInput,
  UpdateFolderInput,
  EntityValidationResult,
  EntityMetadata
} from './entities'

export {
  NOTE_METADATA,
  FOLDER_METADATA,
  RECENT_NOTE_METADATA
} from './entities'

// Filter types
export type {
  BaseFilter,
  NoteFilters,
  FolderFilters,
  RecentNotesFilters,
  SearchFilters,
  FilterOperator,
  AdvancedFilter,
  CompoundFilter,
  QueryMetadata,
  QueryResult,
  FilterValidationResult,
  FilterPreset
} from './filters'

export {
  COMMON_NOTE_FILTERS
} from './filters'

// Provider types
export type {
  DatabaseProvider,
  BaseProviderConfig,
  DexieProviderConfig,
  SupabaseProviderConfig,
  ProviderConfig,
  DatabaseConfig,
  ProviderCapabilities,
  ProviderStatus,
  ProviderInfo,
  IDatabaseProvider,
  ITransactionContext,
  SyncResult,
  SyncConflict,
  DatabaseBackup,
  ImportResult,
  IProviderFactory
} from './providers'

// Event types
export type {
  BaseEvent,
  DatabaseChangeType,
  DatabaseTable,
  DatabaseChangeEvent,
  NoteChangeEvent,
  FolderChangeEvent,
  RecentNoteChangeEvent,
  AnyDatabaseChangeEvent,
  DatabaseChangeListener,
  NoteChangeListener,
  FolderChangeListener,
  RecentNoteChangeListener,
  EventSubscriptionOptions,
  EventSubscription,
  BatchedEvent,
  ConnectionEvent,
  SyncEvent,
  ErrorEvent,
  PerformanceEvent,
  DatabaseEvent,
  DatabaseEventListener,
  IDatabaseEventEmitter,
  EventFilter,
  EventTransformer,
  EventMiddleware,
  IEventStore,
  EventAnalytics
} from './events'

export {
  DEFAULT_EVENT_OPTIONS,
  EVENT_PRIORITIES
} from './events'

// Error types
export type {
  ErrorSeverity,
  ErrorCategory,
  ErrorCode,
  ErrorContext,
  ErrorDetails,
  IErrorHandler,
  IErrorReporter,
  ErrorRecoveryStrategy,
  BatchErrorResult
} from './errors'

export {
  ERROR_CODES,
  DatabaseError,
  NotFoundError,
  ValidationError,
  ConnectionError,
  SyncError,
  TransactionError,
  isDatabaseError,
  isRetryableError,
  isCriticalError,
  isNetworkError,
  isValidationError,
  isNotFoundError
} from './errors'

// Re-import for utility types
import type {
  Note,
  Folder,
  RecentNote,
  CreateNoteInput,
  CreateFolderInput,
  UpdateNoteInput,
  UpdateFolderInput,
  NoteFilters,
  FolderFilters,
  RecentNotesFilters
} from './entities'
import type { DatabaseError } from './errors'
import type { DatabaseProvider, IDatabaseProvider, ProviderConfig } from './providers'

// Type utility helpers
export type EntityType = Note | Folder | RecentNote
export type EntityInput = CreateNoteInput | CreateFolderInput
export type EntityUpdate = UpdateNoteInput | UpdateFolderInput
export type EntityFilters = NoteFilters | FolderFilters | RecentNotesFilters

// Common type combinations
export interface DatabaseOperationResult<T = EntityType> {
  success: boolean
  data?: T
  error?: DatabaseError
  metadata?: {
    operation: string
    duration: number
    affectedRecords: number
  }
}

export interface BulkOperationResult<T = EntityType> {
  successful: T[]
  failed: DatabaseError[]
  metadata: {
    totalRequested: number
    totalSuccessful: number
    totalFailed: number
    duration: number
  }
}

// Database state types for React components
export interface DatabaseState {
  isConnected: boolean
  isInitializing: boolean
  currentProvider: DatabaseProvider | null
  lastError: DatabaseError | null
  syncStatus: 'idle' | 'syncing' | 'error'
  lastSyncAt: string | null
}

// Hook return types
export interface DatabaseHookResult {
  state: DatabaseState
  provider: IDatabaseProvider | null
  switchProvider: (provider: DatabaseProvider, config?: ProviderConfig) => Promise<void>
  reconnect: () => Promise<void>
  clearError: () => void
}

// Store state types
export interface NotesStoreState {
  notes: Note[]
  currentNote: Note | null
  isLoading: boolean
  error: DatabaseError | null
  lastUpdated: string | null
}

export interface FoldersStoreState {
  folders: Folder[]
  isLoading: boolean
  error: DatabaseError | null
  lastUpdated: string | null
}

export interface SearchStoreState {
  recentNotes: RecentNote[]
  isLoading: boolean
  error: DatabaseError | null
  lastUpdated: string | null
}