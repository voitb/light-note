import { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useNotesStore, type Note } from "@/lib/store/notes-store";

export function useNoteEditor() {
  const { userId, id, noteId: routeNoteId } = useParams<{ userId?: string; id?: string; noteId?: string }>();
  const navigate = useNavigate();

  const effectiveUserId = userId || "default";
  const currentNoteId = routeNoteId || id;
  
  const { 
    getNote, 
    updateNote, 
    setCurrentNote, 
    addNote, 
    deleteNote, 
    currentNote: noteFromStore 
  } = useNotesStore();

  // Lokalne tymczasowe stany tylko dla UI
  const [newTag, setNewTag] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(currentNoteId === "new");
  
  // Referencja do pola wprowadzania tagów
  const tagInputRef = useRef<HTMLInputElement>(null);

  // Lokalny stan formularza (tymczasowy, niezapisany w Zustand)
  const [draftNote, setDraftNote] = useState<Partial<Note>>(() => {
    if (currentNoteId === "new") {
      return {
        title: "",
        content: "",
        tags: [],
        isPinned: false
      };
    } else if (currentNoteId) {
      const foundNote = getNote(currentNoteId);
      if (foundNote) {
        setCurrentNote(foundNote);
        return {
          title: foundNote.title,
          content: foundNote.content,
          tags: foundNote.tags || [],
          isPinned: foundNote.isPinned
        };
      } else {
        navigate(`/notes/${effectiveUserId}`);
        return {};
      }
    }
    return {};
  });

  // Efekt odpowiedzialny za ładowanie notatki, gdy zmienia się currentNoteId
  // Dzięki temu edytor zaktualizuje się po kliknięciu w inną notatkę w sidebarze
  useEffect(() => {
    // Pomijamy inicjalizację początkową - ta jest już obsłużona w useState wyżej
    const handleNoteIdChange = () => {
      if (currentNoteId === "new") {
        setDraftNote({
          title: "",
          content: "",
          tags: [],
          isPinned: false
        });
        setCurrentNote(null);
        setIsEditing(true);
        return;
      } 
      
      if (currentNoteId) {
        const foundNote = getNote(currentNoteId);
        if (foundNote) {
          setDraftNote({
            title: foundNote.title,
            content: foundNote.content,
            tags: foundNote.tags || [],
            isPinned: foundNote.isPinned
          });
          setCurrentNote(foundNote);
          // Domyślnie pokazujemy podgląd po wybraniu notatki z sidebara
          setIsEditing(false);
        } else {
          navigate(`/notes/${effectiveUserId}`);
        }
      }
    };
    
    handleNoteIdChange();
  }, [currentNoteId, effectiveUserId, getNote, setCurrentNote, navigate]);

  // Oblicz, czy są niezapisane zmiany
  const hasUnsavedChanges = (() => {
    if (currentNoteId === "new") {
      return (
        (draftNote.title?.trim() || "").length > 0 ||
        (draftNote.content?.trim() || "").length > 0 ||
        (draftNote.tags?.length || 0) > 0 ||
        draftNote.isPinned === true
      );
    } else if (noteFromStore) {
      return (
        draftNote.title !== noteFromStore.title ||
        draftNote.content !== noteFromStore.content ||
        JSON.stringify([...(draftNote.tags || [])].sort()) !== JSON.stringify([...(noteFromStore.tags || [])].sort()) ||
        draftNote.isPinned !== noteFromStore.isPinned
      );
    }
    return false;
  })();

  const saveChanges = (updatedFields: Partial<Omit<Note, 'id' | 'createdAt' | 'updatedAt'>>, exitEditMode = true) => {
    setIsSaving(true);
    
    // Połącz aktualne wartości draftu z podanymi aktualizacjami
    const finalTitle = ((updatedFields.title !== undefined ? updatedFields.title : draftNote.title) || "").trim() || "Untitled note";
    const finalContent = updatedFields.content !== undefined ? updatedFields.content : draftNote.content || "";
    const finalTags = updatedFields.tags !== undefined ? updatedFields.tags : draftNote.tags || [];
    const finalIsPinned = updatedFields.isPinned !== undefined ? updatedFields.isPinned : draftNote.isPinned || false;

    const noteDataToSave = {
      userId: effectiveUserId,
      title: finalTitle,
      content: finalContent,
      tags: finalTags,
      isPinned: finalIsPinned,
    };

    if (currentNoteId === "new") {
      const newNoteId = addNote(noteDataToSave);
      
      // Aktualizuj lokalny stan draftu po zapisie
      setDraftNote({
        title: finalTitle,
        content: finalContent,
        tags: finalTags,
        isPinned: finalIsPinned
      });
      
      // Pobierz zapisaną notatkę i ustaw jako current
      const savedNote = getNote(newNoteId);
      if (savedNote) {
        setCurrentNote(savedNote);
      }
      
      setLastSaved(new Date());
      if (exitEditMode) setIsEditing(false);
      navigate(`/notes/${effectiveUserId}/${newNoteId}`, { replace: true });
    } else if (currentNoteId) {
      updateNote(currentNoteId, noteDataToSave);
      
      // Aktualizuj lokalny stan draftu po zapisie
      setDraftNote({
        title: finalTitle,
        content: finalContent,
        tags: finalTags,
        isPinned: finalIsPinned
      });
      
      // Pobierz zaktualizowaną notatkę i ustaw jako current
      const updatedNote = getNote(currentNoteId);
      if (updatedNote) {
        setCurrentNote(updatedNote);
      }
      
      setLastSaved(new Date());
      if (exitEditMode) setIsEditing(false);
    }
    
    setTimeout(() => setIsSaving(false), 500);
  };

  const handleSave = () => {
    saveChanges(draftNote, true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDraftNote(prev => ({ ...prev, title: e.target.value }));
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraftNote(prev => ({ ...prev, content: e.target.value }));
  };

  const toggleNotePinStatus = () => {
    // Najpierw aktualizujemy lokalny stan draftu
    const newPinnedState = !(draftNote.isPinned || false);
    setDraftNote(prev => ({ ...prev, isPinned: newPinnedState }));
    
    // Następnie od razu zapisujemy zmiany bez wychodzenia z trybu edycji
    // Używamy { isPinned: newPinnedState } jako updatedFields, aby zachować inne zmiany w draftNote
    if (currentNoteId && currentNoteId !== "new") {
      saveChanges({ isPinned: newPinnedState }, false);
    } else if (currentNoteId === "new" && hasUnsavedChanges) {
      // Jeśli to nowa notatka z niezapisanymi zmianami, zapisujemy całą notatkę
      saveChanges({ 
        title: draftNote.title,
        content: draftNote.content,
        tags: draftNote.tags,
        isPinned: newPinnedState
      }, false);
    }
  };

  const handleNewTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTag(e.target.value);
  };

  const addTag = () => {
    const trimmedTag = newTag.trim().toLowerCase();
    if (trimmedTag && !(draftNote.tags || []).includes(trimmedTag)) {
      setDraftNote(prev => ({ 
        ...prev, 
        tags: [...(prev.tags || []), trimmedTag] 
      }));
    }
    setNewTag("");
    tagInputRef.current?.focus();
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (tagToRemove: string) => {
    setDraftNote(prev => ({ 
      ...prev, 
      tags: (prev.tags || []).filter(tag => tag !== tagToRemove) 
    }));
  };

  const openDeleteDialog = () => setDeleteDialogOpen(true);

  const handleDelete = () => {
    if (currentNoteId && currentNoteId !== "new") {
      deleteNote(currentNoteId);
      setDeleteDialogOpen(false);
      navigate(`/notes/${effectiveUserId}`);
    }
  };

  const toggleEditMode = () => {
    if (isEditing && hasUnsavedChanges) {
      console.log("Wyjście z trybu edycji z niezapisanymi zmianami. Warto rozważyć monit o zapisanie.");
    }
    
    // Jeśli wchodzimy w tryb edycji, zaktualizuj draft najnowszymi danymi z Zustand store
    if (!isEditing && noteFromStore) {
      setDraftNote({
        title: noteFromStore.title,
        content: noteFromStore.content,
        tags: noteFromStore.tags || [],
        isPinned: noteFromStore.isPinned
      });
    }
    
    setIsEditing(prev => !prev);
  };

  const handlePreviewDoubleClick = () => {
    setIsEditing(true);
  };

  return {
    note: noteFromStore,
    title: draftNote.title || "",
    content: draftNote.content || "",
    tags: draftNote.tags || [],
    newTag,
    setNewTag,
    isPinned: draftNote.isPinned || false,
    lastSaved,
    isSaving,
    hasUnsavedChanges,
    isEditing,
    setIsEditing,
    deleteDialogOpen,
    setDeleteDialogOpen,
    tagInputRef,
    handleTitleChange,
    handleContentChange,
    handleNewTagChange,
    addTag,
    handleTagKeyDown,
    removeTag,
    openDeleteDialog,
    handleDelete,
    handleSave,
    toggleEditMode,
    handlePreviewDoubleClick,
    toggleNotePinStatus,
  };
} 