import { useRef, useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useNotesStore, type Note } from "@/store/notes-store";

export function useNoteEditor() {
  const { userId, id, noteId: routeNoteId } = useParams<{ userId?: string; id?: string; noteId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if edit mode is requested via query parameter
  const queryParams = new URLSearchParams(location.search);
  const shouldEnableEditMode = queryParams.get('edit') === 'true';

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

  // Local temporary states for UI only
  const [newTag, setNewTag] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(currentNoteId === "new" || shouldEnableEditMode);
  
  // Reference to the tag input field
  const tagInputRef = useRef<HTMLInputElement>(null);

  // Local form state (temporary, not saved in Zustand)
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

  // Effect responsible for loading note when currentNoteId changes
  // This ensures the editor updates after clicking another note in the sidebar
  useEffect(() => {
    // Skip initial initialization - this is already handled in useState above
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
          
          // Check if edit mode should be enabled from URL parameter
          const params = new URLSearchParams(location.search);
          const editMode = params.get('edit') === 'true';
          setIsEditing(editMode);
        } else {
          navigate(`/notes/${effectiveUserId}`);
        }
      }
    };
    
    handleNoteIdChange();
  }, [currentNoteId, effectiveUserId, getNote, setCurrentNote, navigate, location.search]);

  // Calculate whether there are unsaved changes
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
    
    // Combine current draft values with provided updates
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
      
      // Update local draft state after saving
      setDraftNote({
        title: finalTitle,
        content: finalContent,
        tags: finalTags,
        isPinned: finalIsPinned
      });
      
      // Get saved note and set as current
      const savedNote = getNote(newNoteId);
      if (savedNote) {
        setCurrentNote(savedNote);
      }
      
      setLastSaved(new Date());
      if (exitEditMode) setIsEditing(false);
      
      // Navigate without the edit parameter if exit edit mode is requested
      const targetPath = exitEditMode 
        ? `/notes/${effectiveUserId}/${newNoteId}` 
        : `/notes/${effectiveUserId}/${newNoteId}?edit=true`;
      
      navigate(targetPath, { replace: true });
    } else if (currentNoteId) {
      updateNote(currentNoteId, noteDataToSave);
      
      // Update local draft state after saving
      setDraftNote({
        title: finalTitle,
        content: finalContent,
        tags: finalTags,
        isPinned: finalIsPinned
      });
      
      // Get updated note and set as current
      const updatedNote = getNote(currentNoteId);
      if (updatedNote) {
        setCurrentNote(updatedNote);
      }
      
      setLastSaved(new Date());
      if (exitEditMode) {
        setIsEditing(false);
        
        // If we're exiting edit mode, make sure the URL doesn't have edit=true
        if (location.search.includes('edit=true')) {
          navigate(location.pathname, { replace: true });
        }
      }
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
    // First update the local draft state
    const newPinnedState = !(draftNote.isPinned || false);
    setDraftNote(prev => ({ ...prev, isPinned: newPinnedState }));
    
    // Then immediately save changes without exiting edit mode
    // Use { isPinned: newPinnedState } as updatedFields to preserve other changes in draftNote
    if (currentNoteId && currentNoteId !== "new") {
      saveChanges({ isPinned: newPinnedState }, false);
    } else if (currentNoteId === "new" && hasUnsavedChanges) {
      // If this is a new note with unsaved changes, save the entire note
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
      console.log("Exiting edit mode with unsaved changes. Consider prompting to save.");
    }
    
    const newEditingState = !isEditing;
    setIsEditing(newEditingState);
    
    // Update URL query parameter based on new editing state
    if (newEditingState) {
      // Add edit=true to URL if entering edit mode
      navigate(`${location.pathname}?edit=true`, { replace: true });
    } else {
      // Remove edit=true from URL if exiting edit mode
      navigate(location.pathname, { replace: true });
    }
    
    // If entering edit mode, update draft with latest data from Zustand store
    if (newEditingState && noteFromStore) {
      setDraftNote({
        title: noteFromStore.title,
        content: noteFromStore.content,
        tags: noteFromStore.tags || [],
        isPinned: noteFromStore.isPinned
      });
    }
  };

  const discardChanges = () => {
    // Restore original note state
    if (noteFromStore) {
      setDraftNote({
        title: noteFromStore.title,
        content: noteFromStore.content,
        tags: noteFromStore.tags || [],
        isPinned: noteFromStore.isPinned
      });
    } else if (currentNoteId === "new") {
      setDraftNote({
        title: "",
        content: "",
        tags: [],
        isPinned: false
      });
    }
    
    // Exit edit mode
    setIsEditing(false);
    
    // Remove edit=true from URL if present
    if (location.search.includes('edit=true')) {
      navigate(location.pathname, { replace: true });
    }
  };

  const handlePreviewDoubleClick = () => {
    setIsEditing(true);
    // Update URL to include edit=true
    navigate(`${location.pathname}?edit=true`, { replace: true });
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
    discardChanges,
    handlePreviewDoubleClick,
    toggleNotePinStatus,
  };
} 