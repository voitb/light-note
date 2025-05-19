import { useState } from "react";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AiAssistantDialog } from "./AiAssistantDialog";

export interface NoteFooterBarProps {
  lastSaved: Date | null;
  noteContent?: string;
}

export function NoteFooterBar({ lastSaved, noteContent = "" }: NoteFooterBarProps) {
  const [aiDialogOpen, setAiDialogOpen] = useState(false);

  const formatDate = (date: string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  
  return (
    <>
      <div className="text-xs text-muted-foreground flex justify-between items-center border-t p-2">
        <div className="flex items-center gap-3">
          {lastSaved && (
            <div>Last saved: {formatDate(lastSaved.toISOString())}</div>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2 gap-1.5 text-muted-foreground hover:text-primary"
            onClick={() => setAiDialogOpen(true)}
          >
            <Bot className="h-3.5 w-3.5" />
            <span>AI Assistant</span>
          </Button>
        </div>
        
        <div className="flex gap-3">
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-muted border rounded text-[10px]">
              Escape
            </kbd>
            <span>Close</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-muted border rounded text-[10px]">
              Dbl Click
            </kbd>
            <span>Edit</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-muted border rounded text-[10px]">
              Ctrl
            </kbd>
            <span>+</span>
            <kbd className="px-1.5 py-0.5 bg-muted border rounded text-[10px]">
              S
            </kbd>
            <span>Save</span>
          </div>
        </div>
      </div>
      
      <AiAssistantDialog 
        open={aiDialogOpen} 
        onOpenChange={setAiDialogOpen} 
        noteContent={noteContent}
      />
    </>
  );
}
