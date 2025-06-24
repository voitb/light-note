/**
 * Database Entity Types
 * 
 * Core entity definitions that represent the data models in the database.
 * These types are shared across all database providers.
 */

// Core entity interfaces
export interface Note {
  id: string
  userId: string
  title: string
  content: string
  createdAt: string // ISO string
  updatedAt: string // ISO string
  tags: string[]
  isPinned: boolean
  isShared?: boolean
  folderId?: string
}

export interface Folder {
  id: string
  name: string
  userId: string
  createdAt: string // ISO string
  updatedAt: string // ISO string
  color?: string
  parentId?: string // For nested folders
}

export interface RecentNote {
  id: string          // Note ID (references notes.id)
  title: string       // Note title (cached)
  userId: string      // User identifier
  timestamp: string   // Last accessed timestamp (ISO string)
}

// Entity creation input types (exclude generated fields)
export type CreateNoteInput = Omit<Note, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateNoteInput = Partial<Omit<Note, 'id' | 'createdAt' | 'updatedAt'>>

export type CreateFolderInput = Omit<Folder, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateFolderInput = Partial<Omit<Folder, 'id' | 'createdAt' | 'updatedAt'>>

// Entity validation helpers
export interface EntityValidationResult {
  isValid: boolean
  errors: string[]
  field?: string
}

// Entity metadata
export interface EntityMetadata {
  tableName: string
  primaryKey: string
  timestamps: {
    createdAt: string
    updatedAt: string
  }
  indexes: string[]
}

export const NOTE_METADATA: EntityMetadata = {
  tableName: 'notes',
  primaryKey: 'id',
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  },
  indexes: ['userId', 'folderId', 'isPinned', 'isShared', 'tags']
}

export const FOLDER_METADATA: EntityMetadata = {
  tableName: 'folders',
  primaryKey: 'id',
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  },
  indexes: ['userId', 'parentId']
}

export const RECENT_NOTE_METADATA: EntityMetadata = {
  tableName: 'recent_notes',
  primaryKey: 'id',
  timestamps: {
    createdAt: 'timestamp',
    updatedAt: 'timestamp'
  },
  indexes: ['userId', 'timestamp']
}