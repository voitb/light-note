import { useParams } from "react-router-dom";
import { useNotesStore } from "../../lib/store/notes-store";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Sparkles, FileUp, Command } from "lucide-react";
import { Link } from "react-router-dom";

export function NotesWelcome() {
  const { userId } = useParams();
  const { getNotesByUser } = useNotesStore();
  
  const userNotes = getNotesByUser(userId || "default");
  const hasNotes = userNotes.length > 0;
  const effectiveUserId = userId || "default";
  
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8">
      {/* Content */}
      <div className="p-8 rounded-xl max-w-md w-full flex flex-col items-center border">
        <div className="h-20 w-20 rounded-2xl bg-muted flex items-center justify-center mb-6">
          <FileText className="h-10 w-10 text-foreground/80" />
        </div>
        
        <h2 className="text-2xl font-semibold tracking-tight mb-2 text-center">
          {hasNotes 
            ? "Select a note or create a new one" 
            : "Your workspace awaits"}
        </h2>
        <p className="text-muted-foreground text-center mb-8 max-w-xs">
          {hasNotes 
            ? "Choose from your existing notes or create something new to capture your ideas." 
            : "Start capturing ideas, organizing thoughts, and unleashing your creativity."}
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xs">
          <Button asChild className="gap-2 rounded-xl">
            <Link to={`/notes/${effectiveUserId}/new`}>
              <Plus className="h-4 w-4" />
              New Note
            </Link>
          </Button>
          <Button variant="outline" className="gap-2 rounded-xl">
            <FileUp className="h-4 w-4" />
            Import
          </Button>
        </div>
        
        <div className="mt-8 pt-6 border-t text-xs text-muted-foreground flex flex-col items-center gap-3 w-full">
          <p className="flex items-center gap-2">
            <Sparkles className="h-3 w-3" />
            <span>AI-powered editing and organization</span>
          </p>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground/70">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 bg-muted rounded border text-[10px]">
              <Command className="h-2.5 w-2.5 inline-block mr-0.5" />K
            </kbd>
            <span>for commands</span>
          </div>
        </div>
      </div>
    </div>
  );
} 