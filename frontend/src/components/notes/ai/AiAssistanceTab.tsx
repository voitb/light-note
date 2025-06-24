import { useState } from "react";
import { AlignLeft, ListChecks, Languages, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLLMProvider } from "@/hooks/use-llm-provider";
import { useNotesStore } from "@/store/notes-store";
import type { ChatCompletionMessageParam } from "@mlc-ai/web-llm";

interface AiFeature {
  icon: React.ReactNode;
  name: string;
  description: string;
  promptType: "summarize" | "checklist" | "translate" | "explain";
}

interface AiAssistanceTabProps {
  onInsertResult: (result: string) => void;
  onOverrideResult: (result: string) => void;
}

export function AiAssistanceTab({
  onInsertResult,
  onOverrideResult,
}: AiAssistanceTabProps) {
  const [result, setResult] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const { askModel, isLoading } = useLLMProvider();
  const { getCurrentNote } = useNotesStore();
  const currentNote = getCurrentNote();

  // AI assistance options
  const assistanceOptions: AiFeature[] = [
    {
      icon: <AlignLeft className="h-4 w-4 mr-2" />,
      name: "Summarize",
      description: "Create a concise summary of your note",
      promptType: "summarize",
    },
    {
      icon: <ListChecks className="h-4 w-4 mr-2" />,
      name: "Generate Checklist",
      description: "Create a checklist based on your note content",
      promptType: "checklist",
    },
    {
      icon: <Languages className="h-4 w-4 mr-2" />,
      name: "Translate",
      description: "Translate your note to another language",
      promptType: "translate",
    },
    {
      icon: <Brain className="h-4 w-4 mr-2" />,
      name: "Explain",
      description: "Get an explanation of complex topics in your note",
      promptType: "explain",
    },
  ];

  const createPrompt = (
    type: string,
    text: string
  ): ChatCompletionMessageParam[] => {
    switch (type) {
      case "summarize":
        return [
          {
            role: "system",
            content:
              "You are a helpful assistant that specializes in creating clear, accurate summaries. Your task is to extract only the most important information from the text and present it in 3-5 concise sentences. Focus only on main ideas and key points. Do not add any information that is not in the original text. Be objective and do not give opinions.",
          },
          {
            role: "user",
            content: `I need a summary of the following text. Please follow these specific instructions:
1. Read the entire text carefully
2. Identify only the main topic and key points
3. Create a 3-5 sentence summary that captures the essential information
4. Use simple, clear language
5. Do not include minor details, examples, or your own opinions
6. Present the summary in a single paragraph

Here is the text to summarize:

${text}

Summary:`,
          },
        ] as ChatCompletionMessageParam[];
      case "checklist":
        return [
          {
            role: "system",
            content:
              "You are a helpful assistant that specializes in organizing information into actionable checklists. Your task is to extract tasks, action items, or important points from the text and format them as a clear checklist. Each item should be specific, actionable, and start with a dash (-).",
          },
          {
            role: "user",
            content: `I need a checklist based on the following text. Please follow these specific instructions:
1. Read the entire text carefully
2. Identify all tasks, action items, or important points that should be tracked
3. Create a checklist where each item:
   - Starts with a dash (-) 
   - Is clear and specific
   - Is actionable (describes something that can be done or checked)
   - Is short (preferably under 10 words)
4. Group similar items together
5. Limit the list to maximum 10 items (focus on the most important if there are more)
6. Do not add any explanations or extra text - ONLY the checklist items

Here is the text to analyze:

${text}

Checklist:`,
          },
        ] as ChatCompletionMessageParam[];
      case "translate":
        return [
          {
            role: "system",
            content:
              "You are a helpful assistant that specializes in language translation. Your task is to translate the provided text into English. Maintain the exact meaning, tone, and style of the original text. Do not add, remove, or change any information. Simply translate the content accurately.",
          },
          {
            role: "user",
            content: `I need you to translate the following text to English. Please follow these specific instructions:
1. Read the entire text carefully
2. Translate the text into clear, natural English
3. Preserve the exact meaning of the original text
4. Maintain the same tone and style (formal/informal, technical/casual)
5. Keep the same paragraph structure
6. Do not add explanations or notes about the translation
7. If any terms cannot be directly translated, choose the closest English equivalent

Here is the text to translate:

${text}

English translation:`,
          },
        ] as ChatCompletionMessageParam[];
      case "explain":
        return [
          {
            role: "system",
            content:
              "You are a helpful assistant that specializes in explaining complex concepts in simple terms. Your task is to take technical or complicated text and make it easier to understand for a general audience. Use clear language, simple explanations, and avoid jargon when possible.",
          },
          {
            role: "user",
            content: `I need you to explain the following text in simpler terms. Please follow these specific instructions:
1. Read the entire text carefully
2. Identify any complex concepts, technical terms, or jargon
3. Rewrite the content using:
   - Simpler vocabulary
   - Shorter sentences
   - Clear explanations for technical terms
   - Examples if helpful (but keep them brief)
4. Maintain the same overall meaning and important details
5. Structure your explanation logically with paragraphs
6. Make sure your explanation would be understandable to someone with no background in this topic

Here is the text to explain:

${text}

Simple explanation:`,
          },
        ] as ChatCompletionMessageParam[];
      default:
        return [
          {
            role: "system",
            content:
              "You are a helpful assistant that analyzes text and provides useful insights. Your task is to carefully read the provided text and give a thoughtful analysis of its content, structure, and key points.",
          },
          {
            role: "user",
            content: `Please analyze the following text and provide a useful response. Focus on understanding the main points and offering helpful insights.

${text}

Analysis:`,
          },
        ] as ChatCompletionMessageParam[];
    }
  };

  const handleRunAi = async (feature: AiFeature) => {
    setSelectedFeature(feature.name);
    setIsProcessing(true);
    setResult("");

    try {
      if (!currentNote?.content) {
        setResult(
          "No content to process. Please add some text to your note first."
        );
        setIsProcessing(false);
        return;
      }

      const text = currentNote.content;
      const messages = createPrompt(feature.promptType, text);

      const response = await askModel(messages);
      setResult(response);
    } catch (error) {
      console.error("Error processing AI request:", error);
      setResult(
        "An error occurred while processing your request. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInsertResult = () => {
    onInsertResult(result);
  };

  const handleOverrideResult = () => {
    onOverrideResult(result);
  };

  return (
    <div className="grid gap-4 mt-4">
      <div>
        <Label className="mb-2 block">What would you like to do?</Label>
        <div className="grid grid-cols-2 gap-2">
          {assistanceOptions.map((option) => (
            <Button
              key={option.name}
              variant={selectedFeature === option.name ? "default" : "outline"}
              className="h-auto justify-start p-3 text-left flex flex-col items-start"
              onClick={() => handleRunAi(option)}
              disabled={isProcessing || isLoading}
            >
              <div className="flex items-center text-sm font-medium mb-1">
                {option.icon}
                {option.name}
              </div>
              <span className="text-xs text-muted-foreground">
                {option.description}
              </span>
            </Button>
          ))}
        </div>
      </div>

      {isProcessing && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-pulse text-sm text-muted-foreground">
            Processing {selectedFeature}...
          </div>
        </div>
      )}

      {result && !isProcessing && (
        <div className="flex flex-col gap-2">
          <Label>Result</Label>
          <ScrollArea className="h-[150px] border rounded-md p-3 bg-muted/20">
            <div className="whitespace-pre-wrap text-sm">{result}</div>
          </ScrollArea>
          <div className="flex gap-2 self-end">
            <Button variant="outline" onClick={handleOverrideResult}>
              Replace Note
            </Button>
            <Button onClick={handleInsertResult}>Add to Note</Button>
          </div>
        </div>
      )}
    </div>
  );
}
