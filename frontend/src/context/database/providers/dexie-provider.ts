/**
 * Dexie Database Provider
 * 
 * This provider implements local database storage using Dexie (IndexedDB wrapper).
 * It provides all CRUD operations for notes, folders, and recent notes with full type safety.
 */

import Dexie, { type Table } from 'dexie'
import type {
  IDatabaseProvider,
  Note,
  Folder,
  RecentNote,
  CreateNoteInput,
  UpdateNoteInput,
  CreateFolderInput,
  UpdateFolderInput,
  NoteFilters,
  FolderFilters,
  RecentNotesFilters,
  QueryResult,
  QueryMetadata,
  DatabaseChangeEvent,
  DatabaseChangeListener,
  ProviderInfo,
  ProviderStatus,
  ProviderCapabilities,
  DatabaseConfig,
  ITransactionContext,
  SyncResult,
  DatabaseBackup,
  ImportResult,
  DexieProviderConfig
} from '@/types/database'
import {
  DatabaseError,
  NotFoundError,
  ValidationError,
  ERROR_CODES
} from '@/types/database'

// Database schema interface
interface LightNoteDB {
  notes: Table<Note, string>
  folders: Table<Folder, string>
  recentNotes: Table<RecentNote, string>
  metadata: Table<{ key: string; value: string }, string>
}

// Transaction context implementation
class DexieTransactionContext implements ITransactionContext {
  constructor(private db: LightNoteDexieDB) {}

  async createNote(note: CreateNoteInput): Promise<Note> {
    const now = new Date().toISOString()
    const newNote: Note = {
      ...note,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now
    }
    
    await this.db.notes.add(newNote)
    return newNote
  }

  async updateNote(id: string, updates: UpdateNoteInput): Promise<Note> {
    const existingNote = await this.db.notes.get(id)
    if (!existingNote) {
      throw new NotFoundError('Note', id, 'dexie')
    }

    const updatedNote: Note = {
      ...existingNote,
      ...updates,
      updatedAt: new Date().toISOString()
    }

    await this.db.notes.put(updatedNote)
    return updatedNote
  }

  async deleteNote(id: string): Promise<void> {
    const note = await this.db.notes.get(id)
    if (!note) {
      throw new NotFoundError('Note', id, 'dexie')
    }
    await this.db.notes.delete(id)
  }

  async createFolder(folder: CreateFolderInput): Promise<Folder> {
    const now = new Date().toISOString()
    const newFolder: Folder = {
      ...folder,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now
    }
    
    await this.db.folders.add(newFolder)
    return newFolder
  }

  async updateFolder(id: string, updates: UpdateFolderInput): Promise<Folder> {
    const existingFolder = await this.db.folders.get(id)
    if (!existingFolder) {
      throw new NotFoundError('Folder', id, 'dexie')
    }

    const updatedFolder: Folder = {
      ...existingFolder,
      ...updates,
      updatedAt: new Date().toISOString()
    }

    await this.db.folders.put(updatedFolder)
    return updatedFolder
  }

  async deleteFolder(id: string): Promise<void> {
    const folder = await this.db.folders.get(id)
    if (!folder) {
      throw new NotFoundError('Folder', id, 'dexie')
    }
    await this.db.folders.delete(id)
  }

  async rollback(): Promise<void> {
    throw new DatabaseError(
      'Manual rollback not supported - use Dexie.transaction() wrapper',
      ERROR_CODES.TRANSACTION_FAILED,
      'dexie'
    )
  }

  async commit(): Promise<void> {
    // Dexie auto-commits transactions
  }
}

class LightNoteDexieDB extends Dexie implements LightNoteDB {
  notes!: Table<Note, string>
  folders!: Table<Folder, string>
  recentNotes!: Table<RecentNote, string>
  metadata!: Table<{ key: string; value: string }, string>

  constructor(databaseName: string) {
    super(databaseName)
    
    // Version 1: Initial schema
    this.version(1).stores({
      notes: 'id, userId, title, content, createdAt, updatedAt, *tags, isPinned, isShared, folderId',
      folders: 'id, name, userId, createdAt, updatedAt, color, parentId',
      recentNotes: 'id, title, userId, timestamp',
      metadata: 'key, value'
    })
    
    // Version 2: Add composite indexes for better performance
    this.version(2).stores({
      notes: 'id, userId, title, content, createdAt, updatedAt, *tags, isPinned, isShared, folderId, [userId+folderId]',
      folders: 'id, name, userId, createdAt, updatedAt, color, parentId, [userId+parentId]',
      recentNotes: 'id, title, userId, timestamp, [userId+timestamp]',
      metadata: 'key, value'
    })
  }
}

export class DexieProvider implements IDatabaseProvider {
  private db: LightNoteDexieDB
  private changeListeners: Set<DatabaseChangeListener> = new Set()
  private status: ProviderStatus = 'initializing'
  private connectedAt: string | null = null
  private config: DatabaseConfig
  private capabilities: ProviderCapabilities

  constructor(databaseName = 'LightNoteDB', options: DexieProviderConfig = {}) {
    this.config = {
      provider: 'dexie',
      options: {
        databaseName,
        version: 2,
        enableSync: false,
        enableCache: true,
        enableLogging: false,
        ...options
      }
    }

    this.db = new LightNoteDexieDB(databaseName)
    
    this.capabilities = {
      supportsRealtime: true,
      supportsBulkOperations: true,
      supportsTransactions: true,
      supportsFullTextSearch: false,
      supportsRelations: false,
      supportsIndexes: true,
      supportsBackup: true,
      supportsEncryption: false,
      maxConcurrentConnections: 1,
      maxRecordSize: 1024 * 1024 * 10 // 10MB
    }
  }

  // Provider information
  getInfo(): ProviderInfo {
    return {
      name: 'Dexie Provider',
      version: '1.0.0',
      status: this.status,
      capabilities: this.capabilities,
      config: this.config,
      connectedAt: this.connectedAt,
      lastSync: null // Dexie doesn't support cloud sync
    }
  }

  // Lifecycle methods
  async initialize(): Promise<void> {
    try {
      this.status = 'initializing'
      await this.db.open()
      this.status = 'connected'
      this.connectedAt = new Date().toISOString()
      
      if (this.config.options?.enableLogging) {
        console.log('✅ Dexie database initialized successfully')
      }
    } catch (error) {
      this.status = 'error'
      throw new DatabaseError(
        'Failed to initialize Dexie database',
        ERROR_CODES.CONNECTION_FAILED,
        'dexie',
        {
          category: 'connection',
          severity: 'critical',
          originalError: error as Error,
          context: { operation: 'initialize' }
        }
      )
    }
  }

  async close(): Promise<void> {
    if (this.status !== 'disconnected') {
      this.db.close()
      this.status = 'disconnected'
      this.connectedAt = null
      this.changeListeners.clear()
      
      if (this.config.options?.enableLogging) {
        console.log('🔒 Dexie database closed')
      }
    }
  }

  isConnected(): boolean {
    return this.status === 'connected'
  }

  async ping(): Promise<boolean> {
    try {
      await this.db.metadata.toArray()
      return true
    } catch {
      return false
    }
  }

  getStatus(): ProviderStatus {
    return this.status
  }

  // Private helper methods
  private ensureConnected(): void {
    if (!this.isConnected()) {
      throw new DatabaseError(
        'Database not connected',
        ERROR_CODES.CONNECTION_FAILED,
        'dexie',
        {
          category: 'connection',
          severity: 'high',
          context: { operation: 'ensureConnected' }
        }
      )
    }
  }

  private generateId(): string {
    return crypto.randomUUID()
  }

  private getCurrentTimestamp(): string {
    return new Date().toISOString()
  }

  private emitChange(event: DatabaseChangeEvent): void {
    this.changeListeners.forEach(listener => {
      try {
        listener(event)
      } catch (error) {
        console.error('Error in database change listener:', error)
      }
    })
  }

  private createQueryMetadata(
    totalCount: number,
    filteredCount: number,
    hasMore: boolean,
    startTime: number
  ): QueryMetadata {
    return {
      totalCount,
      filteredCount,
      hasMore,
      executionTime: Date.now() - startTime,
      cacheHit: false
    }
  }

  // Event subscription
  subscribeToChanges(listener: DatabaseChangeListener): () => void {
    this.changeListeners.add(listener)
    return () => this.changeListeners.delete(listener)
  }

  // Notes operations
  async createNote(noteData: CreateNoteInput): Promise<Note> {
    this.ensureConnected()
    
    try {
      // Validate input
      if (!noteData.title && !noteData.content) {
        throw new ValidationError(
          'Note must have either title or content',
          'dexie',
          'title',
          { operation: 'createNote' }
        )
      }

      const now = this.getCurrentTimestamp()
      const note: Note = {
        ...noteData,
        id: this.generateId(),
        createdAt: now,
        updatedAt: now
      }

      await this.db.notes.add(note)
      
      this.emitChange({
        id: this.generateId(),
        type: 'create',
        table: 'notes',
        data: note,
        affectedIds: [note.id],
        timestamp: now,
        source: 'local',
        userId: note.userId
      })

      return note
    } catch (error) {
      if (error instanceof DatabaseError) throw error
      
      throw new DatabaseError(
        'Failed to create note',
        ERROR_CODES.UNKNOWN_ERROR,
        'dexie',
        {
          category: 'unknown',
          severity: 'medium',
          originalError: error as Error,
          context: { operation: 'createNote' }
        }
      )
    }
  }

  async getNote(id: string): Promise<Note | null> {
    this.ensureConnected()
    
    try {
      const note = await this.db.notes.get(id)
      return note || null
    } catch (error) {
      throw new DatabaseError(
        'Failed to get note',
        ERROR_CODES.UNKNOWN_ERROR,
        'dexie',
        {
          category: 'unknown',
          severity: 'low',
          originalError: error as Error,
          context: { operation: 'getNote', recordId: id }
        }
      )
    }
  }

  async getNotes(filters: NoteFilters = {}): Promise<Note[]> {
    const result = await this.getNotesWithMetadata(filters)
    return result.data
  }

  async getNotesWithMetadata(filters: NoteFilters = {}): Promise<QueryResult<Note>> {
    this.ensureConnected()
    
    const startTime = Date.now()
    
    try {
      let query = this.db.notes.toCollection()

      // Apply filters
      if (filters.userId) {
        query = this.db.notes.where('userId').equals(filters.userId)
      }

      if (filters.folderId !== undefined) {
        if (filters.userId) {
          query = this.db.notes.where('[userId+folderId]').equals([filters.userId, filters.folderId])
        } else {
          query = query.filter(note => note.folderId === filters.folderId)
        }
      }

      if (filters.isPinned !== undefined) {
        query = query.filter(note => note.isPinned === filters.isPinned)
      }

      if (filters.isShared !== undefined) {
        query = query.filter(note => note.isShared === filters.isShared)
      }

      if (filters.tags && filters.tags.length > 0) {
        query = query.filter(note => 
          filters.tags!.some(tag => note.tags.includes(tag))
        )
      }

      // Apply search filter
      if (filters.searchQuery) {
        const searchTerm = filters.searchQuery.toLowerCase()
        query = query.filter(note => {
          const searchableText = `${note.title} ${note.content} ${note.tags.join(' ')}`.toLowerCase()
          return searchableText.includes(searchTerm)
        })
      }

      // Apply date range filter
      if (filters.dateRange) {
        query = query.filter(note => {
          const noteDate = new Date(note.updatedAt).getTime()
          const startDate = new Date(filters.dateRange!.start).getTime()
          const endDate = new Date(filters.dateRange!.end).getTime()
          return noteDate >= startDate && noteDate <= endDate
        })
      }

      // Get total count before pagination
      const totalCount = await query.count()

      // Apply sorting
      const sortBy = filters.sortBy || 'updatedAt'
      const sortOrder = filters.sortOrder || 'desc'
      
      let sortedQuery = query
      if (sortOrder === 'desc') {
        sortedQuery = query.reverse().sortBy(sortBy)
      } else {
        sortedQuery = query.sortBy(sortBy)
      }

      // Apply pagination
      let notes = await sortedQuery
      const originalLength = notes.length

      if (filters.offset) {
        notes = notes.slice(filters.offset)
      }
      
      if (filters.limit) {
        notes = notes.slice(0, filters.limit)
      }

      const hasMore = filters.limit ? originalLength > (filters.offset || 0) + filters.limit : false

      return {
        data: notes,
        metadata: this.createQueryMetadata(totalCount, notes.length, hasMore, startTime)
      }
    } catch (error) {
      throw new DatabaseError(
        'Failed to get notes',
        ERROR_CODES.UNKNOWN_ERROR,
        'dexie',
        {
          category: 'unknown',
          severity: 'medium',
          originalError: error as Error,
          context: { operation: 'getNotes' }
        }
      )
    }
  }

  async updateNote(id: string, updates: UpdateNoteInput): Promise<Note> {
    this.ensureConnected()
    
    try {
      const existingNote = await this.db.notes.get(id)
      if (!existingNote) {
        throw new NotFoundError('Note', id, 'dexie')
      }

      const updatedNote: Note = {
        ...existingNote,
        ...updates,
        updatedAt: this.getCurrentTimestamp()
      }

      await this.db.notes.put(updatedNote)
      
      this.emitChange({
        id: this.generateId(),
        type: 'update',
        table: 'notes',
        data: updatedNote,
        previousData: existingNote,
        affectedIds: [id],
        timestamp: updatedNote.updatedAt,
        source: 'local',
        userId: updatedNote.userId
      })

      return updatedNote
    } catch (error) {
      if (error instanceof DatabaseError) throw error
      
      throw new DatabaseError(
        'Failed to update note',
        ERROR_CODES.UNKNOWN_ERROR,
        'dexie',
        {
          category: 'unknown',
          severity: 'medium',
          originalError: error as Error,
          context: { operation: 'updateNote', recordId: id }
        }
      )
    }
  }

  async deleteNote(id: string): Promise<void> {
    this.ensureConnected()
    
    try {
      const note = await this.db.notes.get(id)
      if (!note) {
        throw new NotFoundError('Note', id, 'dexie')
      }

      await this.db.notes.delete(id)
      
      this.emitChange({
        id: this.generateId(),
        type: 'delete',
        table: 'notes',
        data: note,
        affectedIds: [id],
        timestamp: this.getCurrentTimestamp(),
        source: 'local',
        userId: note.userId
      })
    } catch (error) {
      if (error instanceof DatabaseError) throw error
      
      throw new DatabaseError(
        'Failed to delete note',
        ERROR_CODES.UNKNOWN_ERROR,
        'dexie',
        {
          category: 'unknown',
          severity: 'medium',
          originalError: error as Error,
          context: { operation: 'deleteNote', recordId: id }
        }
      )
    }
  }

  // Folder operations (simplified for brevity - similar pattern to notes)
  async createFolder(folderData: CreateFolderInput): Promise<Folder> {
    this.ensureConnected()
    
    try {
      const now = this.getCurrentTimestamp()
      const folder: Folder = {
        ...folderData,
        id: this.generateId(),
        createdAt: now,
        updatedAt: now
      }

      await this.db.folders.add(folder)
      
      this.emitChange({
        id: this.generateId(),
        type: 'create',
        table: 'folders',
        data: folder,
        affectedIds: [folder.id],
        timestamp: now,
        source: 'local',
        userId: folder.userId
      })

      return folder
    } catch (error) {
      throw new DatabaseError(
        'Failed to create folder',
        ERROR_CODES.UNKNOWN_ERROR,
        'dexie',
        {
          originalError: error as Error,
          context: { operation: 'createFolder' }
        }
      )
    }
  }

  async getFolder(id: string): Promise<Folder | null> {
    this.ensureConnected()
    const folder = await this.db.folders.get(id)
    return folder || null
  }

  async getFolders(filters: FolderFilters = {}): Promise<Folder[]> {
    const result = await this.getFoldersWithMetadata(filters)
    return result.data
  }

  async getFoldersWithMetadata(filters: FolderFilters = {}): Promise<QueryResult<Folder>> {
    this.ensureConnected()
    
    const startTime = Date.now()
    let query = this.db.folders.toCollection()

    if (filters.userId && filters.parentId !== undefined) {
      query = this.db.folders.where('[userId+parentId]').equals([filters.userId, filters.parentId])
    } else if (filters.userId) {
      query = this.db.folders.where('userId').equals(filters.userId)
    } else if (filters.parentId !== undefined) {
      query = query.filter(folder => folder.parentId === filters.parentId)
    }

    const totalCount = await query.count()
    const folders = await query.sortBy('name')

    return {
      data: folders,
      metadata: this.createQueryMetadata(totalCount, folders.length, false, startTime)
    }
  }

  async updateFolder(id: string, updates: UpdateFolderInput): Promise<Folder> {
    this.ensureConnected()
    
    const existingFolder = await this.db.folders.get(id)
    if (!existingFolder) {
      throw new NotFoundError('Folder', id, 'dexie')
    }

    const updatedFolder: Folder = {
      ...existingFolder,
      ...updates,
      updatedAt: this.getCurrentTimestamp()
    }

    await this.db.folders.put(updatedFolder)
    return updatedFolder
  }

  async deleteFolder(id: string): Promise<void> {
    this.ensureConnected()
    
    const folder = await this.db.folders.get(id)
    if (!folder) {
      throw new NotFoundError('Folder', id, 'dexie')
    }

    // Check for dependencies
    const childFolders = await this.db.folders.where('parentId').equals(id).count()
    const notesInFolder = await this.db.notes.where('folderId').equals(id).count()

    if (childFolders > 0 || notesInFolder > 0) {
      throw new DatabaseError(
        'Cannot delete folder with children or notes',
        ERROR_CODES.FOREIGN_KEY_VIOLATION,
        'dexie',
        {
          category: 'conflict',
          severity: 'medium',
          context: { operation: 'deleteFolder', recordId: id }
        }
      )
    }

    await this.db.folders.delete(id)
  }

  // Recent notes operations
  async addRecentNote(note: Note, userId: string): Promise<void> {
    this.ensureConnected()
    
    const recentNote: RecentNote = {
      id: note.id,
      title: note.title,
      userId,
      timestamp: this.getCurrentTimestamp()
    }

    // Remove existing entry
    await this.db.recentNotes.where({ id: note.id, userId }).delete()
    
    // Add new entry
    await this.db.recentNotes.add(recentNote)
    
    // Keep only the most recent 10 notes per user
    const allRecentNotes = await this.db.recentNotes
      .where('userId')
      .equals(userId)
      .reverse()
      .sortBy('timestamp')
    
    if (allRecentNotes.length > 10) {
      const toDelete = allRecentNotes.slice(10)
      await this.db.recentNotes.bulkDelete(toDelete.map(n => n.id))
    }
  }

  async getRecentNotes(userId: string, limit = 10): Promise<RecentNote[]> {
    this.ensureConnected()
    
    return await this.db.recentNotes
      .where('userId')
      .equals(userId)
      .reverse()
      .sortBy('timestamp')
      .then(notes => notes.slice(0, limit))
  }

  async getRecentNotesWithMetadata(filters: RecentNotesFilters): Promise<QueryResult<RecentNote>> {
    this.ensureConnected()
    
    const startTime = Date.now()
    const recentNotes = await this.getRecentNotes(filters.userId!, filters.limit)
    
    return {
      data: recentNotes,
      metadata: this.createQueryMetadata(recentNotes.length, recentNotes.length, false, startTime)
    }
  }

  async clearRecentNotes(userId: string): Promise<void> {
    this.ensureConnected()
    await this.db.recentNotes.where('userId').equals(userId).delete()
  }

  // Bulk operations
  async bulkCreateNotes(notes: CreateNoteInput[]): Promise<Note[]> {
    this.ensureConnected()
    
    const now = this.getCurrentTimestamp()
    const notesToCreate: Note[] = notes.map(noteData => ({
      ...noteData,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now
    }))

    await this.db.notes.bulkAdd(notesToCreate)
    return notesToCreate
  }

  async bulkUpdateNotes(updates: Array<{ id: string; updates: UpdateNoteInput }>): Promise<Note[]> {
    this.ensureConnected()
    
    const updatedNotes: Note[] = []
    const now = this.getCurrentTimestamp()

    for (const { id, updates: noteUpdates } of updates) {
      const existingNote = await this.db.notes.get(id)
      if (existingNote) {
        const updatedNote: Note = {
          ...existingNote,
          ...noteUpdates,
          updatedAt: now
        }
        updatedNotes.push(updatedNote)
      }
    }

    if (updatedNotes.length > 0) {
      await this.db.notes.bulkPut(updatedNotes)
    }

    return updatedNotes
  }

  async bulkDeleteNotes(ids: string[]): Promise<void> {
    this.ensureConnected()
    await this.db.notes.bulkDelete(ids)
  }

  async bulkCreateFolders(folders: CreateFolderInput[]): Promise<Folder[]> {
    this.ensureConnected()
    
    const now = this.getCurrentTimestamp()
    const foldersToCreate: Folder[] = folders.map(folderData => ({
      ...folderData,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now
    }))

    await this.db.folders.bulkAdd(foldersToCreate)
    return foldersToCreate
  }

  async bulkUpdateFolders(updates: Array<{ id: string; updates: UpdateFolderInput }>): Promise<Folder[]> {
    this.ensureConnected()
    
    const updatedFolders: Folder[] = []
    const now = this.getCurrentTimestamp()

    for (const { id, updates: folderUpdates } of updates) {
      const existingFolder = await this.db.folders.get(id)
      if (existingFolder) {
        const updatedFolder: Folder = {
          ...existingFolder,
          ...folderUpdates,
          updatedAt: now
        }
        updatedFolders.push(updatedFolder)
      }
    }

    if (updatedFolders.length > 0) {
      await this.db.folders.bulkPut(updatedFolders)
    }

    return updatedFolders
  }

  async bulkDeleteFolders(ids: string[]): Promise<void> {
    this.ensureConnected()
    await this.db.folders.bulkDelete(ids)
  }

  // Utility operations
  async count(table: 'notes' | 'folders', filters: any = {}): Promise<number> {
    this.ensureConnected()
    
    if (table === 'notes') {
      const result = await this.getNotesWithMetadata(filters)
      return result.metadata.totalCount
    } else {
      const result = await this.getFoldersWithMetadata(filters)
      return result.metadata.totalCount
    }
  }

  async exists(table: 'notes' | 'folders', id: string): Promise<boolean> {
    this.ensureConnected()
    
    const dbTable = table === 'notes' ? this.db.notes : this.db.folders
    const item = await dbTable.get(id)
    return !!item
  }

  // Search operations
  async searchNotes(query: string, userId: string, options: {
    includeContent?: boolean
    includeTags?: boolean
    limit?: number
  } = {}): Promise<Note[]> {
    return this.getNotes({
      userId,
      searchQuery: query,
      limit: options.limit || 50
    })
  }

  // Transaction support
  async transaction<T>(callback: (tx: ITransactionContext) => Promise<T>): Promise<T> {
    this.ensureConnected()
    
    return this.db.transaction('rw', this.db.notes, this.db.folders, async () => {
      const tx = new DexieTransactionContext(this.db)
      return await callback(tx)
    })
  }

  // Sync operations (placeholder for local provider)
  async getLastSyncTimestamp(): Promise<string | null> {
    this.ensureConnected()
    
    const metadata = await this.db.metadata.get('lastSyncTimestamp')
    return metadata?.value || null
  }

  async setLastSyncTimestamp(timestamp: string): Promise<void> {
    this.ensureConnected()
    
    await this.db.metadata.put({ key: 'lastSyncTimestamp', value: timestamp })
  }

  async sync(): Promise<SyncResult> {
    // Local provider doesn't support cloud sync
    return {
      success: true,
      syncedAt: this.getCurrentTimestamp(),
      changes: {
        notes: { created: 0, updated: 0, deleted: 0 },
        folders: { created: 0, updated: 0, deleted: 0 }
      }
    }
  }

  // Backup and restore
  async exportData(userId?: string): Promise<DatabaseBackup> {
    this.ensureConnected()
    
    const notes = userId ? await this.getNotes({ userId }) : await this.getNotes()
    const folders = userId ? await this.getFolders({ userId }) : await this.getFolders()
    const recentNotes = userId ? await this.getRecentNotes(userId) : []

    return {
      version: '1.0.0',
      createdAt: this.getCurrentTimestamp(),
      userId,
      data: { notes, folders, recentNotes },
      metadata: {
        totalNotes: notes.length,
        totalFolders: folders.length,
        backupSize: JSON.stringify({ notes, folders, recentNotes }).length
      }
    }
  }

  async importData(backup: DatabaseBackup): Promise<ImportResult> {
    this.ensureConnected()
    
    const result: ImportResult = {
      success: true,
      importedAt: this.getCurrentTimestamp(),
      imported: { notes: 0, folders: 0, recentNotes: 0 },
      skipped: { notes: 0, folders: 0, recentNotes: 0 },
      errors: []
    }

    try {
      // Import folders first (for foreign key dependencies)
      for (const folder of backup.data.folders) {
        try {
          await this.createFolder(folder)
          result.imported.folders++
        } catch (error) {
          result.skipped.folders++
          if (error instanceof Error) {
            result.errors?.push(`Folder ${folder.id}: ${error.message}`)
          }
        }
      }

      // Import notes
      for (const note of backup.data.notes) {
        try {
          await this.createNote(note)
          result.imported.notes++
        } catch (error) {
          result.skipped.notes++
          if (error instanceof Error) {
            result.errors?.push(`Note ${note.id}: ${error.message}`)
          }
        }
      }

      return result
    } catch (error) {
      result.success = false
      if (error instanceof Error) {
        result.errors?.push(error.message)
      }
      return result
    }
  }

  // Cache management
  async clearCache(): Promise<void> {
    // Dexie doesn't have explicit cache - this could clear temporary data if needed
  }

  async getCacheSize(): Promise<number> {
    // Return 0 as Dexie doesn't have explicit cache
    return 0
  }
}