import { create } from 'zustand'
import { persist, type PersistOptions } from 'zustand/middleware'

export interface Note {
  id: string
  userId: string
  title: string
  content: string
  createdAt: string // Store as ISO string instead of Date
  updatedAt: string // Store as ISO string instead of Date
  tags: string[]
  isPinned: boolean
  isShared?: boolean
  folderId?: string // ID of the folder this note belongs to
}

interface NotesState {
  notes: Note[]
  currentNote: Note | null
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => string
  updateNote: (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt' | 'updatedAt'>>) => void
  deleteNote: (id: string) => void
  getNote: (id: string) => Note | undefined
  getNotesByUser: (userId: string) => Note[]
  setCurrentNote: (note: Note | null) => void
  getCurrentNote: () => Note | null
  changeNotePin: (id: string, isPinned: boolean) => void
  moveNoteToFolder: (noteId: string, folderId?: string) => void
  getNotesByFolder: (userId: string, folderId?: string) => Note[]
}

type NotesStorePersist = PersistOptions<NotesState, NotesState>

const persistConfig: NotesStorePersist = {
  name: 'lightnote-notes-storage'
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: [],
      currentNote: null,
      
      addNote: (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
        const id = crypto.randomUUID()
        const now = new Date().toISOString()
        const note: Note = {
          ...noteData,
          id,
          createdAt: now,
          updatedAt: now
        }
        
        set((state: NotesState) => ({
          notes: [...state.notes, note]
        }))
        
        return id
      },
      
      updateNote: (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt' | 'updatedAt'>>) => {
        set((state: NotesState) => ({
          notes: state.notes.map((note: Note) => 
            note.id === id 
              ? { 
                  ...note, 
                  ...updates, 
                  updatedAt: new Date().toISOString() 
                } 
              : note
          ),
          currentNote: state.currentNote?.id === id 
            ? { 
                ...state.currentNote, 
                ...updates, 
                updatedAt: new Date().toISOString() 
              } 
            : state.currentNote
        }))
      },
      
      deleteNote: (id: string) => {
        set((state: NotesState) => ({
          notes: state.notes.filter((note: Note) => note.id !== id),
          currentNote: state.currentNote?.id === id ? null : state.currentNote
        }))
      },
      
      getNote: (id: string) => {
        return get().notes.find((note: Note) => note.id === id)
      },
      
      getNotesByUser: (userId: string) => {
        return get().notes.filter((note: Note) => note.userId === userId)
      },
      
      setCurrentNote: (note: Note | null) => {
        set({ currentNote: note })
      },
      
      getCurrentNote: () => {
        return get().currentNote
      },
      
      changeNotePin: (id: string, isPinned: boolean) => {
        set((state: NotesState) => ({
          notes: state.notes.map((note: Note) => 
            note.id === id ? { ...note, isPinned } : note
          )
        }))
      },

      moveNoteToFolder: (noteId: string, folderId?: string) => {
        set((state: NotesState) => ({
          notes: state.notes.map((note: Note) => 
            note.id === noteId 
              ? { 
                  ...note, 
                  folderId, 
                  updatedAt: new Date().toISOString() 
                } 
              : note
          ),
          currentNote: state.currentNote?.id === noteId 
            ? { 
                ...state.currentNote, 
                folderId, 
                updatedAt: new Date().toISOString() 
              } 
            : state.currentNote
        }))
      },

      getNotesByFolder: (userId: string, folderId?: string) => {
        return get().notes.filter((note: Note) => 
          note.userId === userId && note.folderId === folderId
        )
      }
    }),
    persistConfig
  )
) 