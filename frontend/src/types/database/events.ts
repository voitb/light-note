/**
 * Database Event Types
 * 
 * Event system for real-time database updates and change notifications.
 * These types support reactive UI updates and cross-component synchronization.
 */

import type { Note, Folder, RecentNote } from './entities'

// Base event interface
export interface BaseEvent {
  id: string
  timestamp: string // ISO string
  source: 'local' | 'remote' | 'sync'
  userId?: string
}

// Database change event types
export type DatabaseChangeType = 'create' | 'update' | 'delete' | 'bulk_create' | 'bulk_update' | 'bulk_delete'

// Database table types
export type DatabaseTable = 'notes' | 'folders' | 'recent_notes'

// Main database change event
export interface DatabaseChangeEvent<T = Note | Folder | RecentNote> extends BaseEvent {
  type: DatabaseChangeType
  table: DatabaseTable
  data: T | T[] // Single item for regular operations, array for bulk operations
  previousData?: T // For updates, contains the previous state
  affectedIds: string[] // IDs of all affected records
}

// Specialized event types for type safety
export interface NoteChangeEvent extends DatabaseChangeEvent<Note> {
  table: 'notes'
}

export interface FolderChangeEvent extends DatabaseChangeEvent<Folder> {
  table: 'folders'
}

export interface RecentNoteChangeEvent extends DatabaseChangeEvent<RecentNote> {
  table: 'recent_notes'
}

// Union type for all database events
export type AnyDatabaseChangeEvent = NoteChangeEvent | FolderChangeEvent | RecentNoteChangeEvent

// Event listener types
export type DatabaseChangeListener<T = Note | Folder | RecentNote> = (event: DatabaseChangeEvent<T>) => void
export type NoteChangeListener = (event: NoteChangeEvent) => void
export type FolderChangeListener = (event: FolderChangeEvent) => void
export type RecentNoteChangeListener = (event: RecentNoteChangeEvent) => void

// Event subscription options
export interface EventSubscriptionOptions {
  tables?: DatabaseTable[]
  operations?: DatabaseChangeType[]
  userId?: string
  debounceMs?: number
  batchEvents?: boolean
  batchTimeoutMs?: number
}

// Event subscription result
export interface EventSubscription {
  id: string
  unsubscribe: () => void
  isActive: boolean
  options: EventSubscriptionOptions
}

// Batch event for multiple changes
export interface BatchedEvent extends BaseEvent {
  type: 'batch'
  events: DatabaseChangeEvent[]
  batchSize: number
  timespan: number // milliseconds between first and last event
}

// Connection event for provider status changes
export interface ConnectionEvent extends BaseEvent {
  type: 'connection_change'
  status: 'connected' | 'disconnected' | 'reconnecting' | 'error'
  provider: string
  reason?: string
  retryAttempt?: number
}

// Sync event for data synchronization
export interface SyncEvent extends BaseEvent {
  type: 'sync_start' | 'sync_progress' | 'sync_complete' | 'sync_error'
  progress?: {
    current: number
    total: number
    operation: string
  }
  result?: {
    success: boolean
    changes: number
    conflicts: number
    errors?: string[]
  }
}

// Error event for database operations
export interface ErrorEvent extends BaseEvent {
  type: 'error'
  error: {
    code: string
    message: string
    operation: string
    table?: DatabaseTable
    affectedIds?: string[]
    originalError?: Error
  }
  severity: 'low' | 'medium' | 'high' | 'critical'
  recoverable: boolean
}

// Performance event for monitoring
export interface PerformanceEvent extends BaseEvent {
  type: 'performance'
  operation: string
  duration: number // milliseconds
  table?: DatabaseTable
  recordCount?: number
  cacheHit?: boolean
}

// Union type for all events
export type DatabaseEvent = 
  | DatabaseChangeEvent
  | BatchedEvent
  | ConnectionEvent
  | SyncEvent
  | ErrorEvent
  | PerformanceEvent

// Event listener for any event type
export type DatabaseEventListener = (event: DatabaseEvent) => void

// Event emitter interface
export interface IDatabaseEventEmitter {
  // Subscribe to specific event types
  on<T extends DatabaseEvent>(eventType: T['type'], listener: (event: T) => void): EventSubscription
  
  // Subscribe to database changes with options
  onDatabaseChange<T = Note | Folder | RecentNote>(
    listener: DatabaseChangeListener<T>, 
    options?: EventSubscriptionOptions
  ): EventSubscription
  
  // Subscribe to all events
  onAny(listener: DatabaseEventListener): EventSubscription
  
  // Unsubscribe
  off(subscriptionId: string): void
  
  // Emit events (internal use)
  emit<T extends DatabaseEvent>(event: T): void
  
  // Clear all listeners
  clear(): void
  
  // Get active subscriptions
  getSubscriptions(): EventSubscription[]
}

// Event filter for conditional event handling
export interface EventFilter {
  tables?: DatabaseTable[]
  operations?: DatabaseChangeType[]
  userIds?: string[]
  sources?: ('local' | 'remote' | 'sync')[]
  predicate?: (event: DatabaseEvent) => boolean
}

// Event transformation for modifying events before delivery
export interface EventTransformer<TInput extends DatabaseEvent = DatabaseEvent, TOutput extends DatabaseEvent = DatabaseEvent> {
  transform(event: TInput): TOutput | null // null means skip the event
}

// Event middleware for processing events
export interface EventMiddleware {
  name: string
  priority: number // Higher priority runs first
  process(event: DatabaseEvent, next: () => void): void | Promise<void>
}

// Event store for event persistence and replay
export interface IEventStore {
  store(event: DatabaseEvent): Promise<void>
  getEvents(filters?: EventFilter, limit?: number): Promise<DatabaseEvent[]>
  getEventsSince(timestamp: string, filters?: EventFilter): Promise<DatabaseEvent[]>
  clear(olderThan?: string): Promise<void>
  replay(listener: DatabaseEventListener, filters?: EventFilter): Promise<void>
}

// Event analytics for monitoring
export interface EventAnalytics {
  totalEvents: number
  eventsByType: Record<string, number>
  eventsByTable: Record<DatabaseTable, number>
  averageProcessingTime: number
  errorRate: number
  lastEventTimestamp?: string
}

// Constants for event configuration
export const DEFAULT_EVENT_OPTIONS: Required<EventSubscriptionOptions> = {
  tables: ['notes', 'folders', 'recent_notes'],
  operations: ['create', 'update', 'delete', 'bulk_create', 'bulk_update', 'bulk_delete'],
  userId: undefined as any,
  debounceMs: 0,
  batchEvents: false,
  batchTimeoutMs: 100
}

export const EVENT_PRIORITIES = {
  CRITICAL: 1000,
  HIGH: 800,
  NORMAL: 500,
  LOW: 200,
  BACKGROUND: 100
} as const