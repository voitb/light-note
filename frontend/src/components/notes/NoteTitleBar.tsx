import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Save, Trash, Pin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Note } from "@/store/notes-store";
import React from "react";

export interface NoteTitleBarProps {
  title: string;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEditing: boolean;
  toggleEditMode: () => void;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  onSave: () => void;
  onDelete: () => void;
  note: Note | null;
  isPinned: boolean;
  onTogglePin: () => void;
}

export function NoteTitleBar({
  title,
  onTitleChange,
  isEditing,
  toggleEditMode,
  hasUnsavedChanges,
  isSaving,
  onSave,
  onDelete,
  note,
  isPinned,
  onTogglePin,
}: NoteTitleBarProps) {
  return (
    <div className="border-t border-b pb-2 flex justify-between items-start px-4 pt-3">
      <div className="w-full flex items-center gap-2">
        <Input
          value={title}
          onChange={onTitleChange}
          className="text-lg md:text-xl font-medium border-0 p-0 h-auto focus-visible:ring-0 w-full"
          placeholder="Note title"
        />{" "}
        <Button
          variant={isPinned ? "default" : "ghost"}
          size="icon"
          className={cn(
            "h-8 w-8 rounded-lg ml-1",
            isPinned
              ? "bg-foreground/10 text-foreground"
              : "text-muted-foreground"
          )}
          onClick={onTogglePin}
          aria-pressed={isPinned}
          title={isPinned ? "Unpin note" : "Pin note"}
        >
          <Pin className="h-4 w-4" />
          <span className="sr-only">
            {isPinned ? "Unpin note" : "Pin note"}
          </span>
        </Button>
      </div>
      <div className="flex items-center gap-1 md:gap-2 ml-4">
        {hasUnsavedChanges && !isSaving && (
          <span className="whitespace-nowrap text-xs text-muted-foreground text-center">
            Unsaved changes
          </span>
        )}
        {!isSaving && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 h-8"
            onClick={toggleEditMode}
            title={isEditing ? "Preview" : "Edit"}
          >
            {isEditing ? (
              <Eye className="h-3.5 w-3.5 md:h-4 md:w-4" />
            ) : (
              <Edit className="h-3.5 w-3.5 md:h-4 md:w-4" />
            )}
          </Button>
        )}
        {isSaving ? (
          <span className="text-sm text-gray-500">Saving...</span>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="gap-1 text-xs md:text-sm h-8"
            onClick={onSave}
            disabled={isSaving}
          >
            <Save className="h-3.5 w-3.5 md:h-4 md:w-4" />
            <span className="hidden xs:inline">Save</span>
          </Button>
        )}
        {note && (
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive/90 h-8"
            onClick={onDelete}
          >
            <Trash className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
