/**
 * Database Filter Types
 * 
 * Query filter interfaces for database operations.
 * These types define how to filter and query data from different providers.
 */

// Base filter interface
export interface BaseFilter {
  limit?: number
  offset?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Note-specific filters
export interface NoteFilters extends BaseFilter {
  userId?: string
  folderId?: string | null // null for root notes, undefined for all
  tags?: string[]
  isPinned?: boolean
  isShared?: boolean
  searchQuery?: string
  dateRange?: {
    start: string // ISO string
    end: string   // ISO string
  }
  titleContains?: string
  contentContains?: string
}

// Folder-specific filters
export interface FolderFilters extends BaseFilter {
  userId?: string
  parentId?: string | null // null for root folders, undefined for all
  nameContains?: string
  color?: string
  hasChildren?: boolean
}

// Recent notes filters
export interface RecentNotesFilters extends BaseFilter {
  userId?: string
  since?: string // ISO string - only notes accessed after this time
  maxAge?: number // Maximum age in milliseconds
}

// Search filters (for full-text search)
export interface SearchFilters extends BaseFilter {
  query: string
  userId?: string
  includeContent?: boolean
  includeTags?: boolean
  includeTitle?: boolean
  folderId?: string
  dateRange?: {
    start: string
    end: string
  }
}

// Filter operators for advanced queries
export type FilterOperator = 
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'starts_with'
  | 'ends_with'
  | 'greater_than'
  | 'less_than'
  | 'greater_than_or_equal'
  | 'less_than_or_equal'
  | 'in'
  | 'not_in'
  | 'is_null'
  | 'is_not_null'

// Advanced filter for complex queries
export interface AdvancedFilter {
  field: string
  operator: FilterOperator
  value: unknown
  caseSensitive?: boolean
}

// Compound filter for complex queries
export interface CompoundFilter extends BaseFilter {
  and?: AdvancedFilter[]
  or?: AdvancedFilter[]
  not?: AdvancedFilter
}

// Query result metadata
export interface QueryMetadata {
  totalCount: number
  filteredCount: number
  hasMore: boolean
  executionTime: number // in milliseconds
  cacheHit?: boolean
}

// Query result wrapper
export interface QueryResult<T> {
  data: T[]
  metadata: QueryMetadata
}

// Filter validation
export interface FilterValidationResult {
  isValid: boolean
  errors: string[]
  warnings?: string[]
}

// Filter presets for common queries
export interface FilterPreset {
  name: string
  description: string
  filters: NoteFilters | FolderFilters | RecentNotesFilters
}

// Common filter presets
export const COMMON_NOTE_FILTERS: Record<string, FilterPreset> = {
  recent: {
    name: 'Recent Notes',
    description: 'Notes updated in the last 7 days',
    filters: {
      dateRange: {
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        end: new Date().toISOString()
      },
      sortBy: 'updatedAt',
      sortOrder: 'desc'
    }
  },
  pinned: {
    name: 'Pinned Notes',
    description: 'All pinned notes',
    filters: {
      isPinned: true,
      sortBy: 'updatedAt',
      sortOrder: 'desc'
    }
  },
  shared: {
    name: 'Shared Notes',
    description: 'All shared notes',
    filters: {
      isShared: true,
      sortBy: 'updatedAt',
      sortOrder: 'desc'
    }
  }
}