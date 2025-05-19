import { useParams, useNavigate } from "react-router-dom";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  PanelLeftIcon,
  Plus,
  MoreVertical,
  Share,
  FileDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NotesSidebar } from "./notes-sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotesStore } from "@/lib/store/notes-store";

interface NoteHeaderProps {
  isMobile: boolean;
  toggleSidebar: () => void;
  onOpenShareDialog: () => void;
}

export function NoteHeader({
  isMobile,
  toggleSidebar,
  onOpenShareDialog,
}: NoteHeaderProps) {
  const { userId } = useParams();
  const navigate = useNavigate();
  const effectiveUserId = userId || "default";
  const { getCurrentNote, addNote } = useNotesStore();
  const currentNote = getCurrentNote();

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
    <header className="h-14 border-b z-10 flex items-center justify-between px-4 md:px-6">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <Logo />
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-full w-9 h-9"
              >
                <PanelLeftIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="p-0 w-80 max-w-[80vw] border-r"
            >
              <div className="h-full overflow-y-auto">
                <NotesSidebar />
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex rounded-full w-9 h-9"
            onClick={toggleSidebar}
          >
            <PanelLeftIcon className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* More Options Dropdown and Add Note buttons */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full w-8 h-8 md:w-9 md:h-9"
              >
                <MoreVertical className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Note Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onOpenShareDialog}
                disabled={!currentNote}
              >
                <Share className="mr-2 h-4 w-4" />
                <span>Share Note</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileDown className="mr-2 h-4 w-4" />
                <span>Export Note</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="sm"
            className="h-8 md:h-9 px-3 md:px-4 gap-1 md:gap-2 border-muted hover:bg-muted/30 text-xs md:text-sm"
            onClick={handleCreateNewNote}
          >
            <Plus className="h-3.5 w-3.5 md:h-4 md:w-4" />
            <span className="hidden sm:inline">New Note</span>
          </Button>
        </div>

        {/* Theme toggle with separator */}
        <div className="flex items-center ml-1">
          <div className="border-l h-5 md:h-6 mr-3 border-muted"></div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
