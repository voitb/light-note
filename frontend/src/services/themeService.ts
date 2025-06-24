import { useUserStore } from '@/store/user-store';

export type Theme = 'dark' | 'light' | 'system';

export class ThemeService {
  static getSystemTheme(): Theme {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  static setTheme(theme: Theme): void {
    const root = window.document.documentElement;
    const isDark = theme === 'dark' || (theme === 'system' && this.getSystemTheme() === 'dark');

    root.classList.remove('light', 'dark');
    root.classList.add(isDark ? 'dark' : 'light');
    localStorage.setItem('theme', theme);
  }

  static getTheme(): Theme {
    if (typeof window === 'undefined') return 'system';
    return (localStorage.getItem('theme') as Theme) || 'system';
  }

  static initializeTheme(): void {
    const { preferences } = useUserStore.getState();
    const theme = preferences.theme;
    
    this.setTheme(theme);
    
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(
        mediaQuery.matches ? 'dark' : 'light'
      );
      
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

  static toggleTheme(): void {
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

  static isSystemDarkMode(): boolean {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  static useSystemTheme(): void {
    const { updatePreferences } = useUserStore.getState();
    updatePreferences({ theme: 'system' });
    
    if (this.isSystemDarkMode()) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}

export const themeService = {
  getSystemTheme: ThemeService.getSystemTheme,
  setTheme: ThemeService.setTheme,
  getTheme: ThemeService.getTheme,
  initializeTheme: ThemeService.initializeTheme,
  toggleTheme: ThemeService.toggleTheme,
  isSystemDarkMode: ThemeService.isSystemDarkMode,
  useSystemTheme: ThemeService.useSystemTheme,
};