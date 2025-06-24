import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFoldersStore } from '@/store/folders-store';
import { FolderPlus } from 'lucide-react';

interface CreateFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  parentId?: string;
}

export function CreateFolderDialog({ 
  open, 
  onOpenChange, 
  userId, 
  parentId 
}: CreateFolderDialogProps) {
  const [folderName, setFolderName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addFolder } = useFoldersStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!folderName.trim()) return;
    
    setIsLoading(true);
    
    try {
      addFolder({
        name: folderName.trim(),
        userId,
        parentId
      });
      
      setFolderName('');
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to create folder:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFolderName('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderPlus className="h-5 w-5" />
            Create New Folder
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="folder-name">Folder Name</Label>
            <Input
              id="folder-name"
              placeholder="Enter folder name..."
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              autoFocus
              disabled={isLoading}
            />
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!folderName.trim() || isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Folder'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}