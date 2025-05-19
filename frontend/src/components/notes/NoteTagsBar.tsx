import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tag as TagIcon, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { RefObject } from "react";
import React from "react";

export interface NoteTagsBarProps {
  tags: string[];
  newTag: string;
  tagInputRef: RefObject<HTMLInputElement | null>;
  onNewTagChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTagKeyDown: (e: React.KeyboardEvent) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
}

export function NoteTagsBar({ tags, newTag, tagInputRef, onNewTagChange, onTagKeyDown, onAddTag, onRemoveTag }: NoteTagsBarProps) {
  return (
    <div className="border-b px-4 py-2 flex items-center gap-2">
      <div className="flex items-center gap-1.5">
        <TagIcon className="h-3 w-3 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Tags</span>
      </div>
      <div className="flex flex-wrap gap-1.5 items-center">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="px-2 py-0 h-6 text-xs bg-muted/70 hover:bg-muted gap-1 group"
          >
            <span>{tag}</span>
            <button
              className="text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => onRemoveTag(tag)}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <div className="flex items-center">
          <Input
            ref={tagInputRef}
            type="text"
            value={newTag}
            onChange={onNewTagChange}
            onKeyDown={onTagKeyDown}
            placeholder="Add tag..."
            className="h-6 text-xs border-0 bg-transparent focus-visible:ring-0 p-0 w-[60px] placeholder:text-muted-foreground/70"
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 rounded-full"
            onClick={onAddTag}
            disabled={!newTag.trim()}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
} 