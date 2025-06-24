import { useState } from 'react';
import { ChevronRight, ChevronDown, Folder as FolderIcon, FolderOpen, MoreHorizontal, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, ContextMenuSeparator } from '@/components/ui/context-menu';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { Folder } from '@/store/folders-store';
import { useFolders } from '@/hooks/useFolders';

interface FolderItemProps {
  folder: Folder;
  userId: string;
  level?: number;
  isExpanded?: boolean;
  onToggleExpanded?: (folderId: string) => void;
  onCreateFolder?: (parentId: string) => void;
  onEditFolder?: (folder: Folder) => void;
  onDrop?: (folderId: string, noteId: string) => void;
  allFolders: Folder[];
}

export function FolderItem({
  folder,
  userId,
  level = 0,
  isExpanded = false,
  onToggleExpanded,
  onCreateFolder,
  onEditFolder,
  onDrop,
  allFolders
}: FolderItemProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const { removeFolder, getNotesInFolder } = useFolders(userId);

  const childFolders = allFolders.filter(f => f.parentId === folder.id);
  const hasChildren = childFolders.length > 0;
  const notesCount = getNotesInFolder(folder.id).length;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const noteId = e.dataTransfer.getData('text/note-id');
    if (noteId && onDrop) {
      onDrop(folder.id, noteId);
    }
  };

  const handleDeleteFolder = () => {
    if (confirm(`Are you sure you want to delete "${folder.name}"? All notes will be moved to the root.`)) {
      removeFolder(folder.id);
    }
  };

  const subFolders = allFolders.filter(f => f.parentId === folder.id);

  return (
    <div className="select-none">
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            className={cn(
              "group flex items-center gap-2 p-2 rounded-lg transition-all cursor-pointer",
              "hover:bg-muted/50",
              isDragOver && "bg-primary/10 border-2 border-primary border-dashed",
              level > 0 && "ml-4"
            )}
            style={{ paddingLeft: `${level * 16 + 8}px` }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => onToggleExpanded?.(folder.id)}
          >
            {hasChildren && (
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleExpanded?.(folder.id);
                }}
              >
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </Button>
            )}
            
            {!hasChildren && <div className="w-4" />}
            
            {isExpanded ? (
              <FolderOpen className="h-4 w-4 text-blue-500" />
            ) : (
              <FolderIcon className="h-4 w-4 text-blue-500" />
            )}
            
            <span className="flex-1 text-sm font-medium truncate">
              {folder.name}
            </span>
            
            {notesCount > 0 && (
              <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                {notesCount}
              </span>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onCreateFolder?.(folder.id)}>
                  <FolderIcon className="h-4 w-4 mr-2" />
                  Create Subfolder
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => onEditFolder?.(folder)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Rename Folder
                </DropdownMenuItem>

                {subFolders.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <FolderIcon className="h-4 w-4 mr-2" />
                        Move to Folder
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        {subFolders.map((subFolder) => (
                          <DropdownMenuItem key={subFolder.id}>
                            <FolderIcon className="h-4 w-4 mr-2" />
                            {subFolder.name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  </>
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleDeleteFolder}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Folder
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </ContextMenuTrigger>
        
        <ContextMenuContent>
          <ContextMenuItem onClick={() => onCreateFolder?.(folder.id)}>
            <FolderIcon className="h-4 w-4 mr-2" />
            Create Subfolder
          </ContextMenuItem>
          
          <ContextMenuItem onClick={() => onEditFolder?.(folder)}>
            <Edit className="h-4 w-4 mr-2" />
            Rename Folder
          </ContextMenuItem>
          
          <ContextMenuSeparator />
          <ContextMenuItem 
            onClick={handleDeleteFolder}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Folder
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {/* Render child folders */}
      {isExpanded && hasChildren && (
        <div>
          {childFolders.map((childFolder) => (
            <FolderItem
              key={childFolder.id}
              folder={childFolder}
              userId={userId}
              level={level + 1}
              isExpanded={isExpanded}
              onToggleExpanded={onToggleExpanded}
              onCreateFolder={onCreateFolder}
              onEditFolder={onEditFolder}
              onDrop={onDrop}
              allFolders={allFolders}
            />
          ))}
        </div>
      )}
    </div>
  );
}