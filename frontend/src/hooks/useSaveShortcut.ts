import { useEffect } from "react";

export function useSaveShortcut({
  onSave,
  onClose,
  onDiscard
}: {
  onSave: () => void;
  onClose: () => void;
  onDiscard?: () => void;
}) {
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        onSave();
      }
      if (e.key === "Escape") {
        e.preventDefault();
        if (onDiscard) {
          onDiscard();
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [onSave, onClose, onDiscard]);
} 