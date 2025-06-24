import { create } from 'zustand'
import { persist, type PersistOptions } from 'zustand/middleware'

export interface User {
  id: string
  name?: string | null
  email?: string | null
  subscriptionTier: 'free' | 'pro' | 'business'
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  fontSize: 'small' | 'medium' | 'large'
  fontFamily: 'sans' | 'serif' | 'mono'
}

interface UserState {
  currentUser: User | null
  preferences: UserPreferences
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  updatePreferences: (prefs: Partial<UserPreferences>) => void
  logout: () => void
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  fontSize: 'medium',
  fontFamily: 'sans',
}

type UserStorePersist = PersistOptions<UserState, UserState>

const persistConfig: UserStorePersist = {
  name: 'lightnote-user-storage',
  partialize: (state) => ({
    currentUser: state.currentUser,
    preferences: state.preferences,
    isAuthenticated: state.isAuthenticated,
    setUser: state.setUser,
    updatePreferences: state.updatePreferences,
    logout: state.logout,
  }),
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      currentUser: null,
      preferences: { ...defaultPreferences },
      isAuthenticated: false,
      
      setUser: (user: User | null) => {
        set({
          currentUser: user,
          isAuthenticated: !!user
        })
      },
      
      updatePreferences: (prefs: Partial<UserPreferences>) => {
        set((state: UserState) => ({
          preferences: {
            ...state.preferences,
            ...prefs
          }
        }))
      },
      
      logout: () => {
        set({
          currentUser: null,
          isAuthenticated: false
        })
      }
    }),
    persistConfig
  )
) 