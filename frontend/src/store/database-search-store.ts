/**
 * Database-Aware Search Store
 * 
 * This store provides the same interface as the original search store but uses the database abstraction layer.
 * It maintains compatibility while adding database persistence.
 */

import { create } from 'zustand'
import type { 
  Note,
  RecentNote,
  IDatabaseProvider,
  SearchStoreState
} from '@/types/database'
import { DatabaseError } from '@/types/database'

interface DatabaseSearchState extends SearchStoreState {
  
  // Database reference
  database: IDatabaseProvider | null
  
  // Actions
  setDatabase: (database: IDatabaseProvider) => void
  loadRecentNotes: (userId: string) => Promise<void>
  addRecentNote: (note: Note, userId: string) => Promise<void>
  getRecentNotes: (userId: string) => RecentNote[]
  clearRecentNotes: (userId: string) => Promise<void>
  
  // Utility
  clearError: () => void
  setLoading: (loading: boolean) => void
}

export const useDatabaseSearchStore = create<DatabaseSearchState>((set, get) => ({
  // Initial state
  recentNotes: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
  database: null,

  // Set database instance
  setDatabase: (database: IDatabaseProvider) => {
    set({ database })
  },

  // Load recent notes from database
  loadRecentNotes: async (userId: string) => {
    const { database } = get()
    if (!database) {
      set({ error: 'Database not initialized' })
      return
    }

    try {
      set({ isLoading: true, error: null })
      const recentNotes = await database.getRecentNotes(userId)
      set({ recentNotes, isLoading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load recent notes'
      set({ error: errorMessage, isLoading: false })
      console.error('Failed to load recent notes:', error)
    }
  },

  // Add recent note
  addRecentNote: async (note: Note, userId: string) => {
    const { database } = get()
    if (!database) {
      set({ error: 'Database not initialized' })
      return
    }

    try {
      set({ error: null })
      await database.addRecentNote(note, userId)
      
      // Update local state optimistically
      const recentNote: RecentNote = {
        id: note.id,
        title: note.title,
        userId,
        timestamp: new Date().toISOString()
      }
      
      set(state => {
        // Remove existing entry for this note
        const filteredNotes = state.recentNotes.filter(n => n.id !== note.id)
        
        // Add new entry at the beginning
        const updatedNotes = [recentNote, ...filteredNotes].slice(0, 10) // Keep only 10 most recent
        
        return { recentNotes: updatedNotes }
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add recent note'
      set({ error: errorMessage })
      console.error('Failed to add recent note:', error)
    }
  },

  // Get recent notes (from local state)
  getRecentNotes: (userId: string) => {
    return get().recentNotes.filter(note => note.userId === userId)
  },

  // Clear recent notes
  clearRecentNotes: async (userId: string) => {
    const { database } = get()
    if (!database) {
      set({ error: 'Database not initialized' })
      return
    }

    try {
      set({ isLoading: true, error: null })
      await database.clearRecentNotes(userId)
      
      // Update local state
      set(state => ({
        recentNotes: state.recentNotes.filter(note => note.userId !== userId),
        isLoading: false
      }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to clear recent notes'
      set({ error: errorMessage, isLoading: false })
      console.error('Failed to clear recent notes:', error)
    }
  },

  // Utility functions
  clearError: () => set({ error: null }),
  setLoading: (loading: boolean) => set({ isLoading: loading })
}))

// Export types for compatibility
export type { RecentNote } from '@/types/database'