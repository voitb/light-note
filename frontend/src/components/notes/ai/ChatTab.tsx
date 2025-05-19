import { MessagesSquare, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ChatTab() {
  return (
    <div className="flex flex-col gap-4 h-full">
      <ScrollArea className="flex-1 border rounded-md p-3 bg-muted/20 min-h-[200px]">
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="bg-primary/10 rounded-full p-1.5 h-6 w-6 shrink-0 flex items-center justify-center">
              <Bot className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="bg-muted/30 rounded-lg p-3 text-sm">
              <p>Hello! I'm your AI assistant. How can I help with your notes today?</p>
            </div>
          </div>
        </div>
      </ScrollArea>
      
      <div className="relative">
        <Textarea 
          placeholder="Ask the AI assistant a question..." 
          className="pr-12 resize-none"
          rows={3}
        />
        <Button size="sm" className="absolute bottom-3 right-3 h-8 w-8 p-0 rounded-full">
          <MessagesSquare className="h-4 w-4" />
          <span className="sr-only">Send</span>
        </Button>
      </div>
    </div>
  );
} 