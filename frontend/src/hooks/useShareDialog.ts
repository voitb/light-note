import { useState, useEffect } from "react";
import { useNotesStore } from "@/store/notes-store";

export function useShareDialog() {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  
  const { getCurrentNote, updateNote } = useNotesStore();
  const currentNote = getCurrentNote();

  // Generate share link when dialog opens
  useEffect(() => {
    if (shareDialogOpen && currentNote) {
      // Check if note is already shared
      setIsShared(!!currentNote.isShared);
      
      // Generate share link
      const baseUrl = window.location.origin;
      setShareLink(`${baseUrl}/shared/${currentNote.id}`);
    }
  }, [shareDialogOpen, currentNote]);
  
  // Handle share toggle change
  const handleShareToggle = (checked: boolean) => {
    if (!currentNote) return;
    
    setIsShared(checked);
    
    // Update note with shared status
    updateNote(currentNote.id, {
      isShared: checked
    });
  };
  
  // Copy link to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setCopySuccess(true);
    
    setTimeout(() => {
      setCopySuccess(false);
    }, 2000);
  };
  
  // Open shared note view
  const viewSharedNote = () => {
    if (currentNote) {
      window.open(`/shared/${currentNote.id}`, '_blank');
    }
  };

  return {
    shareDialogOpen,
    setShareDialogOpen,
    isShared,
    shareLink,
    copySuccess,
    currentNote,
    handleShareToggle,
    copyToClipboard,
    viewSharedNote
  };
} 