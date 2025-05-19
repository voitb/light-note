import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { useShareDialog } from "@/hooks/useShareDialog";
import { NoteHeader } from "./NoteHeader";
import { NotesContent } from "./NotesContent";
import { ShareDialog } from "./ShareDialog";

export function NotesLayout() {
  // Use our custom hooks
  const { isMobile, sidebarOpen, toggleSidebar } = useResponsiveLayout();
  const {
    shareDialogOpen,
    setShareDialogOpen,
    isShared,
    shareLink,
    copySuccess,
    handleShareToggle,
    copyToClipboard,
    viewSharedNote
  } = useShareDialog();

  return (
    <div className="w-full h-[100dvh] flex flex-col bg-background">
      {/* Header */}
      <NoteHeader
        isMobile={isMobile}
        toggleSidebar={toggleSidebar}
        onOpenShareDialog={() => setShareDialogOpen(true)}
      />
      
      {/* Main Content Area */}
      <NotesContent sidebarOpen={sidebarOpen} />
      
      {/* Share Note Dialog */}
      <ShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        isShared={isShared}
        shareLink={shareLink}
        copySuccess={copySuccess}
        onShareToggle={handleShareToggle}
        onCopyToClipboard={copyToClipboard}
        onViewSharedNote={viewSharedNote}
      />
    </div>
  );
} 