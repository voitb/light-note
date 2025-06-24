import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Clock, FileText } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotesStore, type Note } from "@/store/notes-store";
import { useSearchStore } from "@/store/search-store";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

export function SearchDialog({
  open,
  onOpenChange,
  userId,
}: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Note[]>([]);
  const navigate = useNavigate();

  const { notes, getNote } = useNotesStore();
  const { getRecentNotes, addRecentNote } = useSearchStore();

  const recentNotes = getRecentNotes(userId);

  // Reset search when dialog opens
  useEffect(() => {
    if (open) {
      setQuery("");
      setSearchResults([]);
    }
  }, [open]);

  // Perform search when query changes
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const results = notes
      .filter(
        (note) =>
          note.userId === userId &&
          (note.title.toLowerCase().includes(lowerQuery) ||
            note.content.toLowerCase().includes(lowerQuery))
      )
      .slice(0, 10); // Limit to 10 results

    setSearchResults(results);

    // Jeśli znaleźliśmy dokładnie 1 wynik, to mógł to być dokładny wynik wyszukiwania
    // więc dodajmy go do historii
    if (
      results.length === 1 &&
      (results[0].title.toLowerCase() === lowerQuery ||
        results[0].title.toLowerCase().startsWith(lowerQuery))
    ) {
      addRecentNote(results[0], userId);
    }
  }, [query, notes, userId, addRecentNote]);

  // Handle note selection
  const handleSelectNote = (noteId: string) => {
    const note = getNote(noteId);
    if (note) {
      addRecentNote(note, userId);
      navigate(`/notes/${userId}/${noteId}`);
      onOpenChange(false);
    }
  };

  // Clear search query
  const clearSearch = () => {
    setQuery("");
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Escape is already handled by the Dialog component
    // Add Ctrl+Backspace to clear the search
    if (e.ctrlKey && e.key === "Backspace") {
      clearSearch();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 flex flex-col overflow-hidden max-h-[85vh]">
        <div className="relative px-4 py-3 border-b flex justify-between items-center">
          <div className="flex items-center flex-1">
            <Search className="h-4 w-4 mr-2 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="border-0 p-0 focus-visible:ring-0 text-base"
              autoFocus
            />
          </div>
        </div>

        <ScrollArea className="flex-1 min-h-0">
          {query.trim() === "" && recentNotes.length > 0 && (
            <div className="p-2">
              <div className="flex items-center px-2 py-1.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1.5" />
                <span>Recently viewed</span>
              </div>

              <div className="space-y-1 mt-1">
                {recentNotes.map((note) => (
                  <button
                    key={note.id}
                    className="w-full text-left flex items-center gap-3 rounded-md px-3 py-2 hover:bg-muted/50 transition-colors"
                    onClick={() => handleSelectNote(note.id)}
                  >
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col overflow-hidden">
                      {note.title ? (
                        <span className="text-sm truncate">{note.title}</span>
                      ) : (
                        <span className="text-sm text-muted-foreground italic truncate">
                          Untitled note
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {query.trim() !== "" && (
            <div className="p-2">
              {searchResults.length > 0 ? (
                <div className="space-y-1">
                  {searchResults.map((note) => (
                    <button
                      key={note.id}
                      className="w-full text-left flex items-start gap-3 rounded-md px-3 py-2 hover:bg-muted/50 transition-colors"
                      onClick={() => handleSelectNote(note.id)}
                    >
                      <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-medium truncate">
                          {note.title}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">
                          {note.content
                            .replace(
                              /^#+ |^\*\*|\*\*$|^\*|\*$|^-|- $|^`|`$/gm,
                              ""
                            )
                            .substring(0, 80)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-3 py-10 text-center">
                  <p className="text-muted-foreground text-sm">
                    No matching notes found
                  </p>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        <div className="border-t px-4 py-2 text-xs text-muted-foreground flex items-center justify-between">
          <div className="flex gap-3">
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-muted border rounded text-[10px]">
                ESC
              </kbd>
              <span>Close</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-muted border rounded text-[10px]">
                Ctrl
              </kbd>
              <span>+</span>
              <kbd className="px-1.5 py-0.5 bg-muted border rounded text-[10px]">
                Backspace
              </kbd>
              <span>Clear</span>
            </div>
          </div>
          {query && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs px-2"
              onClick={clearSearch}
            >
              Clear
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
