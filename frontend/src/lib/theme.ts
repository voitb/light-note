import { useUserStore } from '../store/user-store';

export type Theme = 'dark' | 'light' | 'system'

export function getSystemTheme(): Theme {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

export function setTheme(theme: Theme) {
  const root = window.document.documentElement
  const isDark = theme === 'dark' || (theme === 'system' && getSystemTheme() === 'dark')

  // Apply the theme immediately to prevent flashing
  // Remove existing classes first
  root.classList.remove('light', 'dark')
  
  // Add the appropriate theme class
  root.classList.add(isDark ? 'dark' : 'light')

  // Store the theme preference for persistence
  localStorage.setItem('theme', theme)
}

export function getTheme(): Theme {
  if (typeof window === 'undefined') return 'system'
  
  return (localStorage.getItem('theme') as Theme) || 'system'
}

/**
 * Initialize theme based on user preference
 * This is called once at app startup
 */
export function initializeTheme(): void {
  // Get the theme from user store
  const { preferences } = useUserStore.getState();
  const theme = preferences.theme;
  
  // Apply the theme immediately
  setTheme(theme);
  
  // Set up listener for system theme changes if using system theme
  if (theme === 'system') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Initial setup
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(
      mediaQuery.matches ? 'dark' : 'light'
    );
    
    // Update on change
    mediaQuery.addEventListener('change', (e) => {
      if (useUserStore.getState().preferences.theme === 'system') {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(
          e.matches ? 'dark' : 'light'
        );
      }
    });
  }
}

/**
 * Toggle between light and dark themes
 * This no longer cycles through system mode
 */
export function toggleTheme(): void {
  const { updatePreferences, preferences } = useUserStore.getState();
  const currentTheme = preferences.theme;
  
  const newTheme: Theme = currentTheme === 'dark' ? 'light' : 'dark';
  
  updatePreferences({ theme: newTheme });
  
  if (newTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

/**
 * Check if the system prefers dark mode
 */
export function isSystemDarkMode(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Set theme to follow system preference
 */
export function useSystemTheme(): void {
  const { updatePreferences } = useUserStore.getState();
  updatePreferences({ theme: 'system' });
  
  if (isSystemDarkMode()) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
} 