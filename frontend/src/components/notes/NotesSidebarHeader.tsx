import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Pin as PinIcon, X, Tag as TagIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useNotesStore } from "@/lib/store/notes-store";

export interface NotesSidebarHeaderProps {
  view: "all" | "pinned";
  onViewChange: (view: "all" | "pinned") => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSearchClick: () => void;
  effectiveUserId: string;
  filterTag: string | null;
  onFilterTagClear: () => void;
}

export function NotesSidebarHeader({
  view,
  onViewChange,
  searchQuery,
  onSearchQueryChange,
  onSearchClick,
  effectiveUserId,
  filterTag,
  onFilterTagClear,
}: NotesSidebarHeaderProps) {
  const { addNote } = useNotesStore();
  const navigate = useNavigate();

  const handleCreateNewNote = () => {
    const newNoteId = addNote({
      userId: effectiveUserId,
      title: "Untitled note",
      content: "",
      tags: [],
      isPinned: false,
    });
    navigate(`/notes/${effectiveUserId}/${newNoteId}?edit=true`);
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <Button
            variant={view === "all" ? "default" : "ghost"}
            size="sm"
            className={cn(
              "h-8 rounded-lg text-xs",
              view === "all"
                ? "bg-foreground/10 hover:bg-foreground/15 text-foreground"
                : ""
            )}
            onClick={() => onViewChange("all")}
          >
            All
          </Button>
          <Button
            variant={view === "pinned" ? "default" : "ghost"}
            size="sm"
            className={cn(
              "h-8 rounded-lg text-xs",
              view === "pinned"
                ? "bg-foreground/10 hover:bg-foreground/15 text-foreground"
                : ""
            )}
            onClick={() => onViewChange("pinned")}
          >
            <PinIcon className="h-3 w-3 mr-1" />
            Pinned
          </Button>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 rounded-lg"
          onClick={handleCreateNewNote}
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">New note</span>
        </Button>
      </div>
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          placeholder="Search notes..."
          className="pl-8 h-8 rounded-lg text-sm bg-muted/50 border-muted/60 placeholder:text-muted-foreground/70"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)} // Direct change, dialog opens on click
          onClick={onSearchClick} // Open search dialog
          readOnly // To ensure click primarily opens dialog, search text from dialog
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1.5 top-1.5 h-5 w-5"
            onClick={() => onSearchQueryChange("")} // Clear search query locally
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>
      {filterTag && (
        <div className="flex items-center gap-1">
          <Badge
            variant="outline"
            className="gap-1 px-2 py-0.5 text-xs bg-muted/50 rounded-md"
          >
            <TagIcon className="h-3 w-3" />
            {filterTag}
            <Button
              variant="ghost"
              size="icon"
              className="h-3 w-3 ml-1 p-0"
              onClick={onFilterTagClear}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove filter</span>
            </Button>
          </Badge>
        </div>
      )}
    </div>
  );
}
