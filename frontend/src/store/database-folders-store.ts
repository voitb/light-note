/**
 * Database-Aware Folders Store
 * 
 * This store provides the same interface as the original folders store but uses the database abstraction layer.
 * It maintains compatibility while adding database persistence and real-time sync capabilities.
 */

import { create } from 'zustand'
import type { 
  Folder, 
  CreateFolderInput, 
  UpdateFolderInput, 
  IDatabaseProvider,
  DatabaseChangeEvent,
  FoldersStoreState
} from '@/types/database'
import { DatabaseError } from '@/types/database'

interface DatabaseFoldersState extends FoldersStoreState {
  
  // Database reference
  database: IDatabaseProvider | null
  
  // Actions
  setDatabase: (database: IDatabaseProvider) => void
  loadFolders: (userId: string) => Promise<void>
  addFolder: (folder: CreateFolderInput) => Promise<string | null>
  updateFolder: (id: string, updates: UpdateFolderInput) => Promise<void>
  deleteFolder: (id: string) => Promise<void>
  getFolder: (id: string) => Folder | undefined
  getFoldersByUser: (userId: string) => Folder[]
  getFoldersByParent: (userId: string, parentId?: string) => Folder[]
  
  // Real-time sync
  subscribeToChanges: () => (() => void) | null
  
  // Utility
  clearError: () => void
  setLoading: (loading: boolean) => void
}

export const useDatabaseFoldersStore = create<DatabaseFoldersState>((set, get) => {
  let unsubscribeFromChanges: (() => void) | null = null

  return {
    // Initial state
    folders: [],
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
          if (event.table === 'folders') {
            const { folders } = get()
            
            switch (event.type) {
              case 'create':
                set({ folders: [...folders, event.data as Folder] })
                break
                
              case 'update':
                set({
                  folders: folders.map(folder => folder.id === event.id ? event.data as Folder : folder)
                })
                break
                
              case 'delete':
                set({
                  folders: folders.filter(folder => folder.id !== event.id)
                })
                break
            }
          }
        })
      }
    },

    // Load folders from database
    loadFolders: async (userId: string) => {
      const { database } = get()
      if (!database) {
        set({ error: 'Database not initialized' })
        return
      }

      try {
        set({ isLoading: true, error: null })
        const folders = await database.getFolders({ userId })
        set({ folders, isLoading: false })
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load folders'
        set({ error: errorMessage, isLoading: false })
        console.error('Failed to load folders:', error)
      }
    },

    // Add new folder
    addFolder: async (folderData: CreateFolderInput) => {
      const { database } = get()
      if (!database) {
        set({ error: 'Database not initialized' })
        return null
      }

      try {
        set({ isLoading: true, error: null })
        const folder = await database.createFolder(folderData)
        
        // Update local state immediately (optimistic update)
        set(state => ({
          folders: [...state.folders, folder],
          isLoading: false
        }))
        
        return folder.id
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to add folder'
        set({ error: errorMessage, isLoading: false })
        console.error('Failed to add folder:', error)
        return null
      }
    },

    // Update existing folder
    updateFolder: async (id: string, updates: UpdateFolderInput) => {
      const { database } = get()
      if (!database) {
        set({ error: 'Database not initialized' })
        return
      }

      try {
        set({ isLoading: true, error: null })
        const updatedFolder = await database.updateFolder(id, updates)
        
        // Update local state immediately (optimistic update)
        set(state => ({
          folders: state.folders.map(folder => folder.id === id ? updatedFolder : folder),
          isLoading: false
        }))
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update folder'
        set({ error: errorMessage, isLoading: false })
        console.error('Failed to update folder:', error)
      }
    },

    // Delete folder
    deleteFolder: async (id: string) => {
      const { database } = get()
      if (!database) {
        set({ error: 'Database not initialized' })
        return
      }

      try {
        set({ isLoading: true, error: null })
        await database.deleteFolder(id)
        
        // Update local state immediately (optimistic update)
        set(state => ({
          folders: state.folders.filter(folder => folder.id !== id),
          isLoading: false
        }))
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete folder'
        set({ error: errorMessage, isLoading: false })
        console.error('Failed to delete folder:', error)
      }
    },

    // Get single folder by ID
    getFolder: (id: string) => {
      return get().folders.find(folder => folder.id === id)
    },

    // Get folders by user
    getFoldersByUser: (userId: string) => {
      return get().folders.filter(folder => folder.userId === userId)
    },

    // Get folders by parent
    getFoldersByParent: (userId: string, parentId?: string) => {
      return get().folders.filter(folder => 
        folder.userId === userId && folder.parentId === parentId
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

// Export the original Folder type for compatibility
export type { Folder } from '@/types/database'