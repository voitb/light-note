import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import React from "react";
import { cn } from "@/lib/utils";

export interface NoteEditorSectionProps {
  isEditing: boolean;
  content: string;
  onContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onPreviewDoubleClick: (e: React.MouseEvent) => void;
}

export function NoteEditorSection({
  isEditing,
  content,
  onContentChange,
  onPreviewDoubleClick,
}: NoteEditorSectionProps) {
  return (
    <div className="flex-1 min-h-0">
      {isEditing ? (
        <ScrollArea className="h-full">
          <div className="h-full p-4 " onClick={(e) => e.stopPropagation()}>
            <Textarea
              value={content}
              onChange={onContentChange}
              className="w-full h-full min-h-[50vh] resize-none border-0 p-0 focus-visible:ring-0 text-sm md:text-base leading-relaxed font-mono"
              placeholder="Write your note here... (Markdown supported)"
            />
          </div>
        </ScrollArea>
      ) : (
        <div
          className="w-full h-full overflow-auto p-0 prose prose-sm md:prose-base max-w-none dark:prose-invert"
          onDoubleClick={onPreviewDoubleClick}
        >
          {content ? (
            <ScrollArea className="h-full">
              <div className="p-4">
                <div
                  className={cn(
                    "break-words",
                    "[&_*]:break-words",
                    "[&_pre]:overflow-x-auto",
                    "[&_code]:whitespace-pre-wrap",
                    "[&_p]:break-words",
                    "[&_a]:break-all",
                    "[&_table]:table-fixed"
                  )}
                >
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
              </div>
            </ScrollArea>
          ) : (
            <div className="text-muted-foreground italic p-4 text-center">
              No content yet. Double-click to start editing.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
