import React from 'react';
import { FolderClosed } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { NoteItem } from './NoteItem'; // NoteItemProps is used by NoteItem, not directly here
import type { Note } from '@/lib/store/notes-store';

export interface NotesListProps {
  filteredNotes: Note[];
  effectiveNoteId: string | undefined;
  onSelectTag: (tag: string) => void;
  effectiveUserId: string;
  onOpenDeleteDialog: (note: Note, e: React.MouseEvent) => void;
  searchQuery: string;
  filterTag: string | null;
  onClearFilters: () => void;
}

export function NotesList({
  filteredNotes,
  effectiveNoteId,
  onSelectTag,
  effectiveUserId,
  onOpenDeleteDialog,
  searchQuery,
  filterTag,
  onClearFilters,
}: NotesListProps) {
  return (
    <>
      <div className="px-3">
        <div className="text-xs font-medium text-muted-foreground flex items-center gap-2 mb-2 px-1">
          <FolderClosed className="h-3 w-3" />
          <span>Notes</span>
          <span className="ml-auto text-muted-foreground/60">{filteredNotes.length}</span>
        </div>
      </div>
      <ScrollArea className="flex-1 px-3 min-h-0">
        <div className="h-full flex flex-col space-y-1 pb-4">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                isActive={note.id === effectiveNoteId}
                onSelectTag={onSelectTag}
                userId={effectiveUserId}
                onDelete={(e) => onOpenDeleteDialog(note, e)}
              />
            ))
          ) : (
            <div className="text-center p-4 flex-1 flex items-center justify-center">
              <p className="text-sm text-muted-foreground">No notes found</p>
              {(searchQuery || filterTag) && (
                <Button variant="ghost" size="sm" className="mt-2 h-7 text-xs rounded-lg" onClick={onClearFilters}>
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </>
  );
} 