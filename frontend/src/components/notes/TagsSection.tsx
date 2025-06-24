import { useState } from "react";
import { Tag as TagIcon, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface TagsSectionProps {
  allTags: string[];
  filterTag: string | null;
  onSelectTag: (tag: string) => void;
}

const MAX_VISIBLE_TAGS = 5;

export function TagsSection({
  allTags,
  filterTag,
  onSelectTag,
}: TagsSectionProps) {
  const [showAll, setShowAll] = useState(false);

  if (allTags.length === 0) {
    return null; // Don't render if no tags
  }

  const visibleTags = showAll ? allTags : allTags.slice(0, MAX_VISIBLE_TAGS);
  const remainingTagsCount = allTags.length - MAX_VISIBLE_TAGS;

  return (
    <div className="py-2 border-t">
      <div className="px-3 text-xs font-medium text-muted-foreground flex items-center gap-2 mb-2">
        <TagIcon className="h-3 w-3" />
        <span>Tags</span>
      </div>

      <div className="flex gap-1.5 flex-wrap items-center">
        <ScrollArea>
          <div className="max-h-[200px] px-3">
            {(!showAll ? visibleTags : allTags).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className={cn(
                  "cursor-pointer rounded-md text-xs bg-muted/50 hover:bg-muted/80 transition-colors m-1",
                  filterTag === tag &&
                    "bg-black text-white dark:bg-white dark:text-black"
                )}
                onClick={() => onSelectTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </ScrollArea>
      </div>

      {allTags.length > MAX_VISIBLE_TAGS && (
        <div className="mt-1.5 px-3">
          {!showAll && remainingTagsCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto px-1.5 py-0.5 text-xs text-muted-foreground hover:text-foreground flex items-center"
              onClick={() => {
                setShowAll(true);
              }}
            >
              +{remainingTagsCount} more
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          )}
          {showAll && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto px-1.5 py-0.5 text-xs text-muted-foreground hover:text-foreground flex items-center"
              onClick={() => setShowAll(false)}
            >
              Show less
              <ChevronUp className="h-3 w-3 ml-1" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
