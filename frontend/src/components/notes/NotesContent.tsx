import { Outlet } from "react-router-dom";
import { NotesSidebar } from "./notes-sidebar";

interface NotesContentProps {
  sidebarOpen: boolean;
}

export function NotesContent({ sidebarOpen }: NotesContentProps) {
  return (
    <div className="flex flex-1 overflow-hidden h-[calc(100dvh-3.5rem)]">
      {/* Sidebar - Desktop only */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} border-r h-full overflow-hidden transition-all duration-300 hidden md:block bg-background/95 backdrop-blur-sm`}>
        {sidebarOpen && <NotesSidebar />}
      </div>
      
      {/* Main Content */}
      <div className="flex-1 h-full flex flex-col overflow-hidden"> 
        <Outlet /> 
      </div>
    </div>
  );
} 