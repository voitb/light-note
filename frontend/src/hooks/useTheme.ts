import { useCallback } from 'react';
import { useUserStore } from '@/store/user-store';
import { themeService, type Theme } from '@/services/themeService';

export function useTheme() {
  const { preferences, updatePreferences } = useUserStore();

  const setTheme = useCallback((theme: Theme) => {
    updatePreferences({ theme });
    themeService.setTheme(theme);
  }, [updatePreferences]);

  const toggleTheme = useCallback(() => {
    themeService.toggleTheme();
  }, []);

  const useSystemTheme = useCallback(() => {
    themeService.useSystemTheme();
  }, []);

  return {
    theme: preferences.theme,
    setTheme,
    toggleTheme,
    useSystemTheme,
  };
}