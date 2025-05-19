import { type ReactNode } from "react";
import { CheckCircle2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ModelInfo {
  id: string;
  name: string;
  description: string;
  requirements: string;
  icon: ReactNode;
  size: string;
  performance: string;
  isPremium?: boolean;
  isCloud?: boolean;
}

interface ModelCardProps {
  model: ModelInfo;
  isSelected: boolean;
  onSelect: (modelId: string) => void;
  hasSubscription?: boolean;
}

export function ModelCard({
  model,
  isSelected,
  onSelect,
  hasSubscription = false,
}: ModelCardProps) {
  const isDisabled = model.isPremium && !hasSubscription;

  return (
    <div
      className={cn(
        "border rounded-lg p-2.5 flex flex-col cursor-pointer transition-all",
        isSelected ? "border-primary bg-primary/5" : "border-border",
        isDisabled
          ? "opacity-60 cursor-not-allowed hover:border-border"
          : "hover:border-primary/50 hover:bg-muted/10"
      )}
      onClick={() => !isDisabled && onSelect(model.id)}
    >
      <div className="flex justify-between items-start mb-1">
        <div className="flex items-center gap-1.5">
          <div
            className={cn(
              "rounded-full p-1.5 h-7 w-7 flex items-center justify-center",
              model.isCloud ? "bg-blue-500/10" : "bg-primary/10"
            )}
          >
            {model.icon}
          </div>
          <div>
            <h3 className="font-medium text-sm">{model.name}</h3>
            {model.isPremium && (
              <span className="text-[9px] flex items-center text-blue-500 font-medium">
                <Lock className="h-2.5 w-2.5 mr-0.5" />
                PREMIUM
              </span>
            )}
          </div>
        </div>
        {isSelected && <CheckCircle2 className="h-4 w-4 text-primary" />}
      </div>

      <p className="text-xs text-muted-foreground line-clamp-2 mt-1 mb-2">
        {model.description}
      </p>

      <p className="text-xs text-muted-foreground line-clamp-2 mt-0 mb-2">
        {model.requirements}
      </p>

      <div className="mt-auto grid grid-cols-2 gap-x-1 text-[10px]">
        <div>
          <span className="text-muted-foreground">Size: </span>
          <span>{model.size}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Performance: </span>
          <span>{model.performance}</span>
        </div>
      </div>
    </div>
  );
}
