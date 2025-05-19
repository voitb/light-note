import { createContext, useEffect, useRef, useState } from "react";
import {
  MLCEngine,
  type ChatCompletionMessageParam,
  type InitProgressReport,
} from "@mlc-ai/web-llm";
import axios from "axios";

const LLM_MODEL_KEY = "llm-model";

export const LLMContext = createContext<{
  engine: MLCEngine | null;
  loadModel: (model: string) => Promise<void>;
  askModel: (messages: ChatCompletionMessageParam[]) => Promise<string>;
  isLoading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
}>({
  engine: null,
  isLoading: false,
  loadModel: async () => {},
  askModel: async () => "",
  error: null,
  setError: () => {},
});

export const LLMProvider = ({ children }: { children: React.ReactNode }) => {
  const engine = useRef<MLCEngine | null>(null);
  const [isCloudModel, setIsCloudModel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initProgressCallback = (progress: InitProgressReport) => {
    console.log("Model loading progress:", progress);
    if (progress.text.toLowerCase().includes("finish")) {
      setIsLoading(false);
    }
  };

  const loadModel = async (model: string) => {
    setIsLoading(true);
    if (model === "cloud-model") {
      setIsLoading(false);
      setIsCloudModel(true);
      return;
    }
    if (engine.current) {
      try {
        await engine.current.reload(model);
        localStorage.setItem(LLM_MODEL_KEY, model);
      } catch (error) {
        console.error("Error loading model", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        setError(errorMessage);
      }
    }
  };

  const askModel = async (messages: ChatCompletionMessageParam[]) => {
    if (isCloudModel) {
      console.log("isCloudModel", isCloudModel, import.meta.env.VITE_API_BASE_URL);
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/chat`,
        { messages },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("response", response);
      return response.data;
    }
    if (!engine.current) {
      setError("Model not loaded");
      throw new Error("Model not loaded");
    }
    const chunks = await engine.current.chat.completions.create({
      messages,
      temperature: 1,
      stream: true,
      stream_options: { include_usage: true },
    });

    let reply = "";
    for await (const chunk of chunks) {
      reply += chunk.choices[0]?.delta.content || "";
      console.log(reply);
      if (chunk.usage) {
        console.log(chunk.usage);
      }
    }

    const fullReply = await engine.current.getMessage();
    console.log(fullReply);
    return fullReply;
  };

  useEffect(() => {
    if (engine.current) return;
    const savedModel = localStorage.getItem(LLM_MODEL_KEY);
    const initialize = async () => {
      if (savedModel === "cloud-model") {
        loadModel("cloud-model");
        return;
      }
      engine.current = new MLCEngine({ initProgressCallback });
      console.log("Initializing engine", engine.current);

      if (savedModel) {
        loadModel(savedModel);
      }
    };

    initialize();
  }, []);

  return (
    <LLMContext.Provider
      value={{
        engine: engine.current,
        loadModel,
        askModel,
        isLoading,
        error,
        setError,
      }}
    >
      {children}
    </LLMContext.Provider>
  );
};
