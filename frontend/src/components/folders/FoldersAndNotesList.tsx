import React, { useState, useMemo } from 'react';
import { Folder, FolderPlus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { NoteItem } from '../notes/NoteItem';
import { FolderItem } from './FolderItem';
import { CreateFolderDialog } from './CreateFolderDialog';
import { useFolders } from '@/hooks/useFolders';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import type { Note } from '@/store/notes-store';
import type { Folder as FolderType } from '@/store/folders-store';

export interface FoldersAndNotesListProps {
  filteredNotes: Note[];
  effectiveNoteId: string | undefined;
  onSelectTag: (tag: string) => void;
  effectiveUserId: string;
  onOpenDeleteDialog: (note: Note, e: React.MouseEvent) => void;
  searchQuery: string;
  filterTag: string | null;
  onClearFilters: () => void;
}

export function FoldersAndNotesList({
  filteredNotes,
  effectiveNoteId,
  onSelectTag,
  effectiveUserId,
  onOpenDeleteDialog,
  searchQuery,
  filterTag,
  onClearFilters,
}: FoldersAndNotesListProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [createFolderDialogOpen, setCreateFolderDialogOpen] = useState(false);
  const [createFolderParentId, setCreateFolderParentId] = useState<string | undefined>();
  const { 
    folders, 
    moveNoteToFolder, 
    getFoldersInParent 
  } = useFolders(effectiveUserId);

  // Group notes by folder
  const { notesInRoot, notesByFolder } = useMemo(() => {
    const notesInRoot = filteredNotes.filter(note => !note.folderId);
    const notesByFolder: Record<string, Note[]> = {};
    
    filteredNotes.forEach(note => {
      if (note.folderId) {
        if (!notesByFolder[note.folderId]) {
          notesByFolder[note.folderId] = [];
        }
        notesByFolder[note.folderId].push(note);
      }
    });
    
    return { notesInRoot, notesByFolder };
  }, [filteredNotes]);

  const rootFolders = useMemo(() => 
    getFoldersInParent(undefined), 
    [folders, getFoldersInParent]
  );

  const toggleFolderExpanded = (folderId: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const handleCreateFolder = (parentId?: string) => {
    setCreateFolderParentId(parentId);
    setCreateFolderDialogOpen(true);
  };

  const handleEditFolder = (folder: FolderType) => {
    // You can implement inline editing or use a dialog here
    console.log('Edit folder:', folder.name);
  };

  const handleFolderDrop = (folderId: string, noteId: string) => {
    moveNoteToFolder(noteId, folderId);
  };

  const handleNoteMove = (noteId: string, folderId?: string) => {
    moveNoteToFolder(noteId, folderId);
  };

  // Set up keyboard shortcuts
  useKeyboardShortcuts({
    onNewFolder: () => handleCreateFolder(),
    enabled: true
  });

  const renderFolderWithNotes = (folder: FolderType, level = 0) => {
    const isExpanded = expandedFolders.has(folder.id);
    const folderNotes = notesByFolder[folder.id] || [];
    const childFolders = getFoldersInParent(folder.id);

    return (
      <div key={folder.id}>
        <FolderItem
          folder={folder}
          userId={effectiveUserId}
          level={level}
          isExpanded={isExpanded}
          onToggleExpanded={toggleFolderExpanded}
          onCreateFolder={handleCreateFolder}
          onEditFolder={handleEditFolder}
          onDrop={handleFolderDrop}
          allFolders={folders}
        />
        
        {isExpanded && (
          <div style={{ paddingLeft: `${(level + 1) * 16 + 8}px` }}>
            {/* Render child folders first */}
            {childFolders.map(childFolder => 
              renderFolderWithNotes(childFolder, level + 1)
            )}
            
            {/* Then render notes in this folder */}
            {folderNotes.map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                isActive={note.id === effectiveNoteId}
                onSelectTag={onSelectTag}
                userId={effectiveUserId}
                onDelete={(e) => onOpenDeleteDialog(note, e)}
                folders={folders}
                onMoveToFolder={handleNoteMove}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="px-3">
        <div className="text-xs font-medium text-muted-foreground flex items-center gap-2 mb-2 px-1">
          <Folder className="h-3 w-3" />
          <span>Folders & Notes</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 ml-auto hover:bg-muted"
            onClick={() => handleCreateFolder()}
            title="Create new folder (Cmd+Shift+N)"
          >
            <FolderPlus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 px-3 min-h-0">
        <div className="h-full flex flex-col space-y-1 pb-4">
          {/* Render root folders */}
          {rootFolders.map(folder => renderFolderWithNotes(folder))}
          
          {/* Render notes not in any folder */}
          {notesInRoot.length > 0 && (
            <>
              {rootFolders.length > 0 && (
                <div className="border-t pt-2 mt-2">
                  <div className="text-xs font-medium text-muted-foreground mb-2 px-1">
                    Other Notes
                  </div>
                </div>
              )}
              {notesInRoot.map((note) => (
                <NoteItem
                  key={note.id}
                  note={note}
                  isActive={note.id === effectiveNoteId}
                  onSelectTag={onSelectTag}
                  userId={effectiveUserId}
                  onDelete={(e) => onOpenDeleteDialog(note, e)}
                  folders={folders}
                  onMoveToFolder={handleNoteMove}
                />
              ))}
            </>
          )}

          {filteredNotes.length === 0 && (
            <div className="text-center p-4 flex-1 flex flex-col items-center justify-center">
              <p className="text-sm text-muted-foreground mb-2">No notes found</p>
              {(searchQuery || filterTag) && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 text-xs rounded-lg" 
                  onClick={onClearFilters}
                >
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </div>
      </ScrollArea>

      <CreateFolderDialog
        open={createFolderDialogOpen}
        onOpenChange={setCreateFolderDialogOpen}
        userId={effectiveUserId}
        parentId={createFolderParentId}
      />
    </>
  );
}