import { useCallback, useMemo } from 'react';
import { useFoldersStore } from '@/store/folders-store';
import { useNotesStore } from '@/store/notes-store';

export function useFolders(userId: string) {
  const { 
    addFolder, 
    updateFolder, 
    deleteFolder, 
    getFoldersByUser,
    getFoldersByParent 
  } = useFoldersStore();
  
  const { moveNoteToFolder, getNotesByFolder } = useNotesStore();

  const userFolders = useMemo(() => 
    getFoldersByUser(userId), 
    [userId, getFoldersByUser]
  );

  const createFolder = useCallback(
    (name: string, parentId?: string) => {
      return addFolder({
        name: name.trim(),
        userId,
        parentId
      });
    },
    [addFolder, userId]
  );

  const renameFolder = useCallback(
    (folderId: string, newName: string) => {
      updateFolder(folderId, { name: newName.trim() });
    },
    [updateFolder]
  );

  const removeFolder = useCallback(
    (folderId: string) => {
      // First move all notes in this folder to root
      const notesInFolder = getNotesByFolder(userId, folderId);
      notesInFolder.forEach(note => {
        moveNoteToFolder(note.id, undefined);
      });
      
      // Then delete the folder
      deleteFolder(folderId);
    },
    [deleteFolder, getNotesByFolder, moveNoteToFolder, userId]
  );

  const moveNoteToFolderHandler = useCallback(
    (noteId: string, folderId?: string) => {
      moveNoteToFolder(noteId, folderId);
    },
    [moveNoteToFolder]
  );

  const getNotesInFolder = useCallback(
    (folderId?: string) => {
      return getNotesByFolder(userId, folderId);
    },
    [getNotesByFolder, userId]
  );

  const getFoldersInParent = useCallback(
    (parentId?: string) => {
      return getFoldersByParent(userId, parentId);
    },
    [getFoldersByParent, userId]
  );

  return {
    folders: userFolders,
    createFolder,
    renameFolder,
    removeFolder,
    moveNoteToFolder: moveNoteToFolderHandler,
    getNotesInFolder,
    getFoldersInParent
  };
}