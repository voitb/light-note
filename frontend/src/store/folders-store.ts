import { create } from 'zustand'
import { persist, type PersistOptions } from 'zustand/middleware'

export interface Folder {
  id: string
  name: string
  userId: string
  createdAt: string
  updatedAt: string
  color?: string
  parentId?: string // For nested folders
}

interface FoldersState {
  folders: Folder[]
  addFolder: (folder: Omit<Folder, 'id' | 'createdAt' | 'updatedAt'>) => string
  updateFolder: (id: string, updates: Partial<Omit<Folder, 'id' | 'createdAt' | 'updatedAt'>>) => void
  deleteFolder: (id: string) => void
  getFolder: (id: string) => Folder | undefined
  getFoldersByUser: (userId: string) => Folder[]
  getFoldersByParent: (userId: string, parentId?: string) => Folder[]
}

type FoldersStorePersist = PersistOptions<FoldersState, FoldersState>

const persistConfig: FoldersStorePersist = {
  name: 'lightnote-folders-storage'
}

export const useFoldersStore = create<FoldersState>()(
  persist(
    (set, get) => ({
      folders: [],
      
      addFolder: (folderData: Omit<Folder, 'id' | 'createdAt' | 'updatedAt'>) => {
        const id = crypto.randomUUID()
        const now = new Date().toISOString()
        const folder: Folder = {
          ...folderData,
          id,
          createdAt: now,
          updatedAt: now
        }
        
        set((state: FoldersState) => ({
          folders: [...state.folders, folder]
        }))
        
        return id
      },
      
      updateFolder: (id: string, updates: Partial<Omit<Folder, 'id' | 'createdAt' | 'updatedAt'>>) => {
        set((state: FoldersState) => ({
          folders: state.folders.map((folder: Folder) => 
            folder.id === id 
              ? { 
                  ...folder, 
                  ...updates, 
                  updatedAt: new Date().toISOString() 
                } 
              : folder
          )
        }))
      },
      
      deleteFolder: (id: string) => {
        set((state: FoldersState) => ({
          folders: state.folders.filter((folder: Folder) => folder.id !== id)
        }))
      },
      
      getFolder: (id: string) => {
        return get().folders.find((folder: Folder) => folder.id === id)
      },
      
      getFoldersByUser: (userId: string) => {
        return get().folders.filter((folder: Folder) => folder.userId === userId)
      },

      getFoldersByParent: (userId: string, parentId?: string) => {
        return get().folders.filter((folder: Folder) => 
          folder.userId === userId && folder.parentId === parentId
        )
      }
    }),
    persistConfig
  )
)