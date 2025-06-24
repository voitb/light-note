import { useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNotesStore, type Note } from '@/store/notes-store';
import { useUserStore } from '@/store/user-store';

export function useNotesSidebar() {
  const { id, userId, noteId } = useParams();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [view, setView] = useState<'all' | 'pinned'>('all');
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);

  const effectiveNoteId = noteId || id;
  const effectiveUserId = userId || 'default';

  const { notes, deleteNote } = useNotesStore();
  const { preferences, updatePreferences, currentUser } = useUserStore();

  const userNotes = useMemo(() => 
    notes.filter(note => note.userId === effectiveUserId),
  [notes, effectiveUserId]);

  const filteredNotes = useMemo(() => {
    return userNotes.filter(note => {
      const matchesSearch = searchQuery === "" ||
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = filterTag === null || note.tags.includes(filterTag);
      const matchesView = view === 'all' || (view === 'pinned' && note.isPinned);
      return matchesSearch && matchesTag && matchesView;
    });
  }, [userNotes, searchQuery, filterTag, view]);

  const allTags = useMemo(() => [...new Set(userNotes.flatMap(note => note.tags))], [userNotes]);

  const handleDeleteNote = useCallback(() => {
    if (noteToDelete) {
      deleteNote(noteToDelete.id);
      setDeleteDialogOpen(false);
      setNoteToDelete(null);
      if (noteToDelete.id === effectiveNoteId) {
        navigate(`/notes/${effectiveUserId}`);
      }
    }
  }, [noteToDelete, deleteNote, effectiveNoteId, effectiveUserId, navigate]);

  const openDeleteDialog = useCallback((note: Note, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setNoteToDelete(note);
    setDeleteDialogOpen(true);
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = preferences.theme === 'dark' ? 'light' : 'dark';
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(newTheme);
    requestAnimationFrame(() => {
      updatePreferences({ theme: newTheme });
    });
  }, [preferences.theme, updatePreferences]);

  const getUserInitials = useCallback(() => {
    if (!currentUser || !currentUser.name) return "U";
    return currentUser.name.split(' ')
      .map((part: string) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }, [currentUser]);

  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setFilterTag(null);
  }, []);

  return {
    searchQuery, setSearchQuery,
    filterTag, setFilterTag,
    view, setView,
    searchDialogOpen, setSearchDialogOpen,
    deleteDialogOpen, setDeleteDialogOpen,
    settingsDialogOpen, setSettingsDialogOpen,
    noteToDelete, // Though noteToDelete is internal, its existence drives the dialog
    effectiveNoteId,
    effectiveUserId,
    filteredNotes,
    allTags,
    handleDeleteNote,
    openDeleteDialog,
    toggleTheme,
    getUserInitials,
    currentUser, // Pass currentUser for UserProfileSection
    preferences, // Pass preferences for UserProfileSection
    handleClearFilters,
  };
} 