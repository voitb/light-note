/**
 * Database-Aware Notes Store
 * 
 * This store provides the same interface as the original notes store but uses the database abstraction layer.
 * It maintains compatibility while adding database persistence and real-time sync capabilities.
 */

import { create } from 'zustand'
import type { 
  Note, 
  CreateNoteInput, 
  UpdateNoteInput, 
  IDatabaseProvider,
  DatabaseChangeEvent,
  NotesStoreState
} from '@/types/database'
import { DatabaseError } from '@/types/database'

interface DatabaseNotesState extends NotesStoreState {
  
  // Database reference
  database: IDatabaseProvider | null
  
  // Actions
  setDatabase: (database: IDatabaseProvider) => void
  loadNotes: (userId: string) => Promise<void>
  addNote: (note: CreateNoteInput) => Promise<string | null>
  updateNote: (id: string, updates: UpdateNoteInput) => Promise<void>
  deleteNote: (id: string) => Promise<void>
  getNote: (id: string) => Note | undefined
  getNotesByUser: (userId: string) => Note[]
  setCurrentNote: (note: Note | null) => void
  getCurrentNote: () => Note | null
  changeNotePin: (id: string, isPinned: boolean) => Promise<void>
  moveNoteToFolder: (noteId: string, folderId?: string) => Promise<void>
  getNotesByFolder: (userId: string, folderId?: string) => Note[]
  
  // Real-time sync
  subscribeToChanges: () => (() => void) | null
  
  // Utility
  clearError: () => void
  setLoading: (loading: boolean) => void
}

export const useDatabaseNotesStore = create<DatabaseNotesState>((set, get) => {
  let unsubscribeFromChanges: (() => void) | null = null

  return {
    // Initial state
    notes: [],
    currentNote: null,
    isLoading: false,
    error: null,
    lastUpdated: null,
    database: null,

    // Set database instance and subscribe to changes
    setDatabase: (database: IDatabaseProvider) => {
      // Unsubscribe from previous database
      if (unsubscribeFromChanges) {
        unsubscribeFromChanges()
        unsubscribeFromChanges = null
      }

      set({ database })

      // Subscribe to database changes if supported
      if ('subscribeToChanges' in database && typeof database.subscribeToChanges === 'function') {
        unsubscribeFromChanges = (database as unknown as { subscribeToChanges: (listener: (event: DatabaseChangeEvent) => void) => () => void }).subscribeToChanges((event: DatabaseChangeEvent) => {
          if (event.table === 'notes') {
            const { notes, currentNote } = get()
            
            switch (event.type) {
              case 'create':
                set({ notes: [...notes, event.data as Note] })
                break
                
              case 'update':
                set({
                  notes: notes.map(note => note.id === event.id ? event.data as Note : note),
                  currentNote: currentNote?.id === event.id ? event.data as Note : currentNote
                })
                break
                
              case 'delete':
                set({
                  notes: notes.filter(note => note.id !== event.id),
                  currentNote: currentNote?.id === event.id ? null : currentNote
                })
                break
            }
          }
        })
      }
    },

    // Load notes from database
    loadNotes: async (userId: string) => {
      const { database } = get()
      if (!database) {
        set({ error: 'Database not initialized' })
        return
      }

      try {
        set({ isLoading: true, error: null })
        const notes = await database.getNotes({ userId })
        set({ notes, isLoading: false })
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load notes'
        set({ error: errorMessage, isLoading: false })
        console.error('Failed to load notes:', error)
      }
    },

    // Add new note
    addNote: async (noteData: CreateNoteInput) => {
      const { database } = get()
      if (!database) {
        set({ error: 'Database not initialized' })
        return null
      }

      try {
        set({ isLoading: true, error: null })
        const note = await database.createNote(noteData)
        
        // Update local state immediately (optimistic update)
        set(state => ({
          notes: [...state.notes, note],
          isLoading: false
        }))
        
        return note.id
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to add note'
        set({ error: errorMessage, isLoading: false })
        console.error('Failed to add note:', error)
        return null
      }
    },

    // Update existing note
    updateNote: async (id: string, updates: UpdateNoteInput) => {
      const { database } = get()
      if (!database) {
        set({ error: 'Database not initialized' })
        return
      }

      try {
        set({ isLoading: true, error: null })
        const updatedNote = await database.updateNote(id, updates)
        
        // Update local state immediately (optimistic update)
        set(state => ({
          notes: state.notes.map(note => note.id === id ? updatedNote : note),
          currentNote: state.currentNote?.id === id ? updatedNote : state.currentNote,
          isLoading: false
        }))
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update note'
        set({ error: errorMessage, isLoading: false })
        console.error('Failed to update note:', error)
      }
    },

    // Delete note
    deleteNote: async (id: string) => {
      const { database } = get()
      if (!database) {
        set({ error: 'Database not initialized' })
        return
      }

      try {
        set({ isLoading: true, error: null })
        await database.deleteNote(id)
        
        // Update local state immediately (optimistic update)
        set(state => ({
          notes: state.notes.filter(note => note.id !== id),
          currentNote: state.currentNote?.id === id ? null : state.currentNote,
          isLoading: false
        }))
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete note'
        set({ error: errorMessage, isLoading: false })
        console.error('Failed to delete note:', error)
      }
    },

    // Get single note by ID
    getNote: (id: string) => {
      return get().notes.find(note => note.id === id)
    },

    // Get notes by user
    getNotesByUser: (userId: string) => {
      return get().notes.filter(note => note.userId === userId)
    },

    // Set current note
    setCurrentNote: (note: Note | null) => {
      set({ currentNote: note })
    },

    // Get current note
    getCurrentNote: () => {
      return get().currentNote
    },

    // Change note pin status
    changeNotePin: async (id: string, isPinned: boolean) => {
      await get().updateNote(id, { isPinned })
    },

    // Move note to folder
    moveNoteToFolder: async (noteId: string, folderId?: string) => {
      await get().updateNote(noteId, { folderId })
    },

    // Get notes by folder
    getNotesByFolder: (userId: string, folderId?: string) => {
      return get().notes.filter(note => 
        note.userId === userId && note.folderId === folderId
      )
    },

    // Subscribe to real-time changes
    subscribeToChanges: () => {
      return unsubscribeFromChanges
    },

    // Utility functions
    clearError: () => set({ error: null }),
    setLoading: (loading: boolean) => set({ isLoading: loading })
  }
})

// Export the original Note type for compatibility
export type { Note } from '@/types/database'