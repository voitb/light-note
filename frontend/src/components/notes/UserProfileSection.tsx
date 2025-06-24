import { Settings, User as UserIcon, Moon, Sun } from "lucide-react"; // Renamed User to UserIcon to avoid conflict
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type { User } from "@/store/user-store"; // User type from user-store
import type { UserPreferences } from "@/store/user-store"; // UserPreferences type

export interface UserProfileSectionProps {
  currentUser: User | null;
  preferences: UserPreferences;
  onOpenSettings: () => void;
  settingsDialogOpen: boolean;
  onSettingsDialogChange: (open: boolean) => void;
  onToggleTheme: () => void;
  getUserInitials: () => string;
  allTagsLength: number; // To conditionally add border-t
}

export function UserProfileSection({
  currentUser,
  preferences,
  onOpenSettings,
  settingsDialogOpen,
  onSettingsDialogChange,
  onToggleTheme,
  getUserInitials,
  allTagsLength,
}: UserProfileSectionProps) {
  return (
    <>
      <div
        className={`p-3 ${
          allTagsLength > 0 ? "border-t" : ""
        } flex items-center justify-between`}
      >
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium leading-none">
              {currentUser?.name || "Default User"}
            </span>
            {currentUser?.email && (
              <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                {currentUser.email}
              </span>
            )}
          </div>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 rounded-lg"
          onClick={onOpenSettings}
        >
          <Settings className="h-4 w-4" />
          <span className="sr-only">Settings</span>
        </Button>
      </div>

      {/* Settings Dialog (moved here as it's directly related to this section) */}
      <Dialog open={settingsDialogOpen} onOpenChange={onSettingsDialogChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Customize your LightNote experience
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <div className="flex items-center">
                  <UserIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Label htmlFor="user-info">User Profile</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  {currentUser?.name || "Default User"}{" "}
                  {currentUser?.email ? `(${currentUser.email})` : ""}
                </p>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {preferences.theme === "dark" ? (
                    <Moon className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Sun className="h-4 w-4 text-muted-foreground" />
                  )}
                  <Label htmlFor="theme-mode">Dark Mode</Label>
                </div>
                <Switch
                  id="theme-mode"
                  checked={preferences.theme === "dark"}
                  onCheckedChange={onToggleTheme}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => onSettingsDialogChange(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
