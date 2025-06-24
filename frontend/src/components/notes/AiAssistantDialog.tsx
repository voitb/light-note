import { useState, useEffect, useCallback } from "react";
import { Bot, Sparkles, Brain, Cloud, Loader2, Cpu } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ModelSelectionScreen } from "./ai/ModelSelectionScreen";
import { AiAssistanceTab } from "./ai/AiAssistanceTab";
import { type ModelInfo } from "./ai/ModelCard";
import { useLLMProvider } from "@/hooks/use-llm-provider";
import { useNotesStore } from "@/store/notes-store";

const LLM_MODEL_KEY = "llm-model";

// Definition of available models with their descriptions and requirements
const availableModels: ModelInfo[] = [
  {
    id: "Llama-3.2-1B-Instruct-q4f16_1-MLC",
    name: "Tiny",
    description:
      "Fast responses with basic understanding. Ideal for simple tasks.",
    requirements: "Less resource intensive, works on most devices",
    icon: <Bot className="h-4 w-4" />,
    size: "500MB",
    performance: "Basic",
  },
  {
    id: "stablelm-2-zephyr-1_6b-q4f16_1-MLC-1k",
    name: "Small",
    description: "Good balance between performance and resource usage.",
    requirements: "Moderate resource usage, recommended for most laptops",
    icon: <Sparkles className="h-4 w-4" />,
    size: "1.5GB",
    performance: "Good",
  },
  {
    id: "Llama-2-7b-chat-hf-q4f16_1-MLC-1k",
    name: "Medium",
    description: "More sophisticated understanding and detailed responses.",
    requirements: "Requires a modern device with sufficient RAM",
    icon: <Brain className="h-4 w-4" />,
    size: "4GB",
    performance: "Great",
  },
  {
    id: "Mistral-7B-Instruct-v0.3-q4f16_1-MLC",
    name: "Large",
    description: "High-quality responses with deep context understanding.",
    requirements: "High-end device with good GPU recommended",
    icon: <Sparkles className="h-4 w-4" />,
    size: "4GB",
    performance: "Best",
  },
  {
    id: "cloud-model",
    name: "Cloud",
    description:
      "Premium cloud model. No local resources needed, runs remotely. Best quality responses with minimal device impact.",
    requirements: "Works on any device, requires internet connection",
    icon: <Cloud className="h-4 w-4" />,
    size: "0MB (Cloud)",
    performance: "Premium",
    isPremium: true,
    isCloud: true,
  },
];

interface AiAssistantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  noteContent?: string;
}

export function AiAssistantDialog({
  open,
  onOpenChange,
}: AiAssistantDialogProps) {
  const [selectedModelId, setSelectedModelId] = useState<string>("local");
  const [isFirstTimeSetup, setIsFirstTimeSetup] = useState<boolean>(false);
  const [hasSubscription, setHasSubscription] = useState<boolean>(false);
  const { isLoading, loadModel, error, setError } = useLLMProvider();
  const { getCurrentNote, updateNote } = useNotesStore();

  const checkSubscription = useCallback(() => {
    setHasSubscription(true);
  }, []);

  useEffect(() => {
    const savedModel = localStorage.getItem(LLM_MODEL_KEY);
    if (savedModel) {
      setSelectedModelId(savedModel);
    } else {
      setIsFirstTimeSetup(true);
    }
    checkSubscription();
  }, [checkSubscription]);

  const handleModelSelection = (modelId: string) => {
    setSelectedModelId(modelId);
  };

  const handleConfirmModelSelection = () => {
    loadModel(selectedModelId);
    setError(null);
    setIsFirstTimeSetup(false);
    localStorage.setItem(LLM_MODEL_KEY, selectedModelId);
  };

  const handleInsertResult = (result: string) => {
    const currentNote = getCurrentNote();
    console.log("currentNote", currentNote);
    if (currentNote) {
      updateNote(currentNote.id, {
        content: currentNote.content
          ? `${currentNote.content}\n\n${result}`
          : result,
      });
    }
    onOpenChange(false);
  };

  const handleOverrideResult = (result: string) => {
    const currentNote = getCurrentNote();
    if (currentNote) {
      updateNote(currentNote.id, {
        content: result,
      });
    }
    onOpenChange(false);
  };

  const handleChangeModel = () => {
    setIsFirstTimeSetup(true);
    localStorage.removeItem(LLM_MODEL_KEY);
  };

  useEffect(() => {
    if (error) {
      setIsFirstTimeSetup(true);
      localStorage.removeItem(LLM_MODEL_KEY);
      console.error("Error loading model", error);
    }
  }, [error]);

  if (isFirstTimeSetup) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <ModelSelectionScreen
          error={error}
          selectedModelId={selectedModelId}
          models={availableModels}
          onModelSelect={handleModelSelection}
          onConfirm={handleConfirmModelSelection}
          hasSubscription={hasSubscription}
        />
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-muted-foreground" />
            <DialogTitle>AI Assistant</DialogTitle>
          </div>
          <DialogDescription>
            Use AI to enhance your notes with summaries, translations, and more.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="h-10 w-10 text-muted-foreground animate-spin mb-4" />
            <p className="text-sm text-muted-foreground">Loading model...</p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col space-y-4 overflow-hidden">
            <AiAssistanceTab
              onInsertResult={handleInsertResult}
              onOverrideResult={handleOverrideResult}
            />
          </div>
        )}

        <DialogFooter className="sm:justify-between border-t pt-4 items-center">
          <div className="text-xs text-muted-foreground">
            Using locally processed AI (no data sent to cloud)
          </div>
          <div className="flex gap-2 items-center">
            <Button
              variant="outline"
              onClick={handleChangeModel}
              className="flex items-center gap-1"
              disabled={isLoading}
            >
              <Cpu className="h-3.5 w-3.5" />
              Change Model
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
