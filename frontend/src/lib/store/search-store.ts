import { create } from 'zustand'
import { persist, type PersistOptions } from 'zustand/middleware'
import type { Note } from './notes-store'

interface RecentNote {
  id: string
  title: string
  userId: string
  timestamp: string // ISO date string
}

interface SearchState {
  recentNotes: RecentNote[]
  addRecentNote: (note: Note, userId: string) => void
  getRecentNotes: (userId: string) => RecentNote[]
  clearRecentNotes: (userId: string) => void
}

const MAX_RECENT_NOTES = 3

type SearchStorePersist = PersistOptions<SearchState, SearchState>

const persistConfig: SearchStorePersist = {
  name: 'lightnote-search-storage'
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      recentNotes: [],
      
      addRecentNote: (note: Note, userId: string) => {
        set((state: SearchState) => {
          // Utwórz kopię recentNotes
          const notes = [...state.recentNotes]
          
          // Sprawdź, czy notatka o takim ID już istnieje
          const existingIndex = notes.findIndex(n => n.id === note.id)
          
          // Jeśli istnieje, usuń ją (będzie dodana na początek)
          if (existingIndex !== -1) {
            notes.splice(existingIndex, 1)
          }
          
          // Dodaj nową notatkę na początek
          const recentNote: RecentNote = {
            id: note.id,
            title: note.title,
            userId: userId,
            timestamp: new Date().toISOString()
          }
          
          notes.unshift(recentNote)
          
          // Ogranicz listę do MAX_RECENT_NOTES
          const trimmedNotes = notes.slice(0, MAX_RECENT_NOTES)
          
          return { recentNotes: trimmedNotes }
        })
      },
      
      getRecentNotes: (userId: string) => {
        return get().recentNotes.filter(note => note.userId === userId)
      },
      
      clearRecentNotes: (userId: string) => {
        set((state: SearchState) => ({
          recentNotes: state.recentNotes.filter(note => note.userId !== userId)
        }))
      }
    }),
    persistConfig
  )
) 