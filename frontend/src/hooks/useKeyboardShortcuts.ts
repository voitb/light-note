import { useEffect } from 'react';

interface KeyboardShortcutsOptions {
  onSave?: () => void;
  onClose?: () => void;
  onDiscard?: () => void;
  onNewNote?: () => void;
  onNewFolder?: () => void;
  onSearch?: () => void;
  onTogglePin?: () => void;
  enabled?: boolean;
}

export function useKeyboardShortcuts({
  onSave,
  onClose,
  onDiscard,
  onNewNote,
  onNewFolder,
  onSearch,
  onTogglePin,
  enabled = true
}: KeyboardShortcutsOptions) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? event.metaKey : event.ctrlKey;

      // Cmd/Ctrl + S - Save
      if (cmdOrCtrl && event.key === 's') {
        event.preventDefault();
        onSave?.();
        return;
      }

      // Cmd/Ctrl + Enter - Save and close
      if (cmdOrCtrl && event.key === 'Enter') {
        event.preventDefault();
        onSave?.();
        onClose?.();
        return;
      }

      // Escape - Close/Cancel
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose?.();
        return;
      }

      // Cmd/Ctrl + Z - Discard (when not in input fields)
      if (cmdOrCtrl && event.key === 'z' && !event.shiftKey) {
        const target = event.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          event.preventDefault();
          onDiscard?.();
          return;
        }
      }

      // Cmd/Ctrl + N - New note
      if (cmdOrCtrl && event.key === 'n' && !event.shiftKey) {
        event.preventDefault();
        onNewNote?.();
        return;
      }

      // Cmd/Ctrl + Shift + N - New folder
      if (cmdOrCtrl && event.shiftKey && event.key === 'N') {
        event.preventDefault();
        onNewFolder?.();
        return;
      }

      // Cmd/Ctrl + K - Search
      if (cmdOrCtrl && event.key === 'k') {
        event.preventDefault();
        onSearch?.();
        return;
      }

      // Cmd/Ctrl + P - Toggle pin
      if (cmdOrCtrl && event.key === 'p') {
        event.preventDefault();
        onTogglePin?.();
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onSave, onClose, onDiscard, onNewNote, onNewFolder, onSearch, onTogglePin, enabled]);
}