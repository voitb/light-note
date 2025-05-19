import { Share, Copy, Check, LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isShared: boolean;
  shareLink: string;
  copySuccess: boolean;
  onShareToggle: (checked: boolean) => void;
  onCopyToClipboard: () => void;
  onViewSharedNote: () => void;
}

export function ShareDialog({
  open,
  onOpenChange,
  isShared,
  shareLink,
  copySuccess,
  onShareToggle,
  onCopyToClipboard,
  onViewSharedNote
}: ShareDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Note</DialogTitle>
          <DialogDescription>
            Create a shareable link to your note that anyone can view.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center space-x-2 py-4">
          <Switch 
            id="share-toggle" 
            checked={isShared} 
            onCheckedChange={onShareToggle}
          />
          <Label htmlFor="share-toggle">
            {isShared ? "Note is currently shared" : "Make this note publicly accessible"}
          </Label>
        </div>
        
        {isShared && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="share-link" className="sr-only">
                  Share link
                </Label>
                <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-ring">
                  <LinkIcon className="ml-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="share-link"
                    value={shareLink}
                    readOnly
                    className="border-0 focus-visible:ring-0"
                  />
                </div>
              </div>
              <Button 
                size="sm" 
                className="px-3" 
                variant="outline" 
                onClick={onCopyToClipboard}
              >
                {copySuccess ? (
                  <><Check className="mr-1 h-4 w-4" /> Copied</>
                ) : (
                  <><Copy className="mr-1 h-4 w-4" /> Copy</>
                )}
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground">
              Anyone with this link can view this note without editing permissions.
            </div>
          </div>
        )}
        
        <DialogFooter className="sm:justify-between">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          
          {isShared && (
            <Button onClick={onViewSharedNote}>
              <Share className="mr-2 h-4 w-4" />
              View Shared Note
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 