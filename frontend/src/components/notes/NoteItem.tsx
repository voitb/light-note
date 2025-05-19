import { Link } from "react-router-dom";
import { Pin, Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Note } from "@/lib/store/notes-store"; // Ensure Note type is imported
import React from "react";

export interface NoteItemProps {
  note: Note;
  isActive: boolean;
  onSelectTag: (tag: string) => void;
  userId: string;
  onDelete: (e: React.MouseEvent) => void;
}

export function NoteItem({
  note,
  isActive,
  onSelectTag,
  userId,
  onDelete,
}: NoteItemProps) {
  const contentPreview = note.content.replace(
    /^#+ |^\*\*|\*\*$|^\*|\*$|^-|- $|^`|`$/gm,
    ""
  );

  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateObj.toDateString() === now.toDateString()) {
      return "Today";
    } else if (dateObj.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return dateObj.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <div className="group relative">
      <Link
        to={`/notes/${userId}/${note.id}`}
        className={cn(
          "flex flex-col gap-1 p-2 transition-all rounded-lg",
          isActive ? "bg-primary/10" : "hover:bg-muted/50"
        )}
      >
        <div className="flex items-start justify-between gap-2 pr-7">
          <h3
            className={cn(
              "font-medium truncate text-sm flex-1 min-w-0",
              isActive ? "text-primary" : "text-foreground"
            )}
          >
            {note.title}
          </h3>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 break-words max-h-10 overflow-hidden">
          {contentPreview}
        </p>

        <div className="flex items-center justify-between mt-1">
          <span className="text-[10px] text-muted-foreground flex items-center">
            <Clock className="h-2.5 w-2.5 mr-1" />
            {formatDate(note.updatedAt)}
            {note.isPinned && (
              <Pin
                className={cn(
                  "h-3 w-3 shrink-0 ml-1.5",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              />
            )}
          </span>

          {note.tags.length > 0 && (
            <div className="flex gap-1">
              {note.tags.slice(0, 1).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-[8px] px-1 py-0 h-4 rounded hover:bg-primary/5"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onSelectTag(tag);
                  }}
                >
                  {tag}
                </Badge>
              ))}
              {note.tags.length > 1 && (
                <span className="text-[8px] text-muted-foreground">
                  +{note.tags.length - 1}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-1.5 top-1.5 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-background/80 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDelete(e);
        }}
      >
        <Trash2 className="h-3.5 w-3.5" />
        <span className="sr-only">Delete note</span>
      </Button>
    </div>
  );
}
