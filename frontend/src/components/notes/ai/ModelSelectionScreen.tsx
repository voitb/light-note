import { Cpu, AlertCircle } from "lucide-react";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ModelCard, type ModelInfo } from "./ModelCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ModelSelectionScreenProps {
  selectedModelId: string;
  models: ModelInfo[];
  onModelSelect: (modelId: string) => void;
  onConfirm: () => void;
  hasSubscription?: boolean;
  error?: string | null;
}

export function ModelSelectionScreen({
  selectedModelId,
  models,
  onModelSelect,
  onConfirm,
  hasSubscription = false,
  error,
}: ModelSelectionScreenProps) {
  return (
    <DialogContent className="sm:max-w-[650px] max-h-[80vh] flex flex-col">
      <DialogHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Cpu className="h-5 w-5 text-muted-foreground" />
          <DialogTitle>Choose AI Model</DialogTitle>
        </div>
        <DialogDescription>
          Select an AI model based on your device capabilities.
        </DialogDescription>
      </DialogHeader>

      <ScrollArea className="flex-1 pr-4">
        <div className="max-h-[calc(80vh-207px)]">
          {error && (
            <Alert variant="destructive" className="my-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="ml-2">{error}</AlertDescription>
            </Alert>
          )}

          <div className="py-2 space-y-3">
            <p className="text-xs text-muted-foreground">
              Models are processed locally on your device. Choose based on your
              hardware limitations.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {models.map((model) => (
                <div
                  key={model.id}
                  className={model.isPremium ? "col-span-full" : ""}
                >
                  <ModelCard
                    model={model}
                    isSelected={selectedModelId === model.id}
                    onSelect={onModelSelect}
                    hasSubscription={hasSubscription}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      <DialogFooter className="pt-4 mt-2 border-t">
        <Button disabled={!selectedModelId} onClick={onConfirm}>
          {"Confirm Selection"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
