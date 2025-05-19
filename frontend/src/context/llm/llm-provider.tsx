import {
  createContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  MLCEngine,
  type ChatCompletionMessageParam,
  type InitProgressReport,
} from "@mlc-ai/web-llm";
import axios from "axios";

const LLM_MODEL_KEY = "llm-model";
const DEFAULT_TEMPERATURE = 1;

type LLMContextType = {
  engine: MLCEngine | null;
  loadModel: (model: string) => Promise<void>;
  askModel: (messages: ChatCompletionMessageParam[]) => Promise<string>;
  isLoading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
};

const defaultContextValue: LLMContextType = {
  engine: null,
  isLoading: false,
  loadModel: async () => {},
  askModel: async () => "",
  error: null,
  setError: () => {},
};

export const LLMContext = createContext<LLMContextType>(defaultContextValue);

export const LLMProvider = ({ children }: { children: React.ReactNode }) => {
  const engine = useRef<MLCEngine | null>(null);
  const [isCloudModel, setIsCloudModel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((error: unknown): string => {
    const errorMessage =
      error instanceof Error ? error.message : "Nieznany błąd";
    setError(errorMessage);
    return errorMessage;
  }, []);

  const initProgressCallback = useCallback((progress: InitProgressReport) => {
    console.log("Model loading progress:", progress);
    if (progress.text.toLowerCase().includes("finish")) {
      setIsLoading(false);
    }
  }, []);

  const askCloudModel = useCallback(
    async (messages: ChatCompletionMessageParam[]): Promise<string> => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/chat`,
          { messages },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        let reply = "";
        for await (const chunk of response.data.choices) {
          reply += chunk?.message.content || "";
          if (chunk.usage) {
            console.log(chunk.usage);
          }
        }

        return reply;
      } catch (error) {
        throw new Error(handleError(error));
      }
    },
    [handleError]
  );

  const askLocalModel = useCallback(
    async (messages: ChatCompletionMessageParam[]): Promise<string> => {
      if (!engine.current) {
        throw new Error("Model nie został załadowany");
      }

      try {
        const chunks = await engine.current.chat.completions.create({
          messages,
          temperature: DEFAULT_TEMPERATURE,
          stream: true,
          stream_options: { include_usage: true },
        });

        for await (const chunk of chunks) {
          if (chunk.usage) {
            console.log(chunk.usage);
          }
        }

        return await engine.current.getMessage();
      } catch (error) {
        throw new Error(handleError(error));
      }
    },
    [handleError]
  );

  const askModel = useCallback(
    async (messages: ChatCompletionMessageParam[]): Promise<string> => {
      try {
        if (isCloudModel) {
          return await askCloudModel(messages);
        } else {
          return await askLocalModel(messages);
        }
      } catch (error) {
        const message = handleError(error);
        throw new Error(message);
      }
    },
    [isCloudModel, askCloudModel, askLocalModel, handleError]
  );

  const loadModel = useCallback(
    async (model: string): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        if (model === "cloud-model") {
          setIsCloudModel(true);
          setIsLoading(false);
          localStorage.setItem(LLM_MODEL_KEY, model);
          return;
        }

        if (!engine.current) {
          throw new Error("Silnik modelu nie jest zainicjalizowany");
        }

        await engine.current.reload(model);
        setIsCloudModel(false);
        localStorage.setItem(LLM_MODEL_KEY, model);
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [handleError]
  );

  useEffect(() => {
    if (engine.current) return;

    const initializeEngine = async () => {
      const savedModel = localStorage.getItem(LLM_MODEL_KEY);

      if (savedModel === "cloud-model") {
        await loadModel("cloud-model");
        return;
      }

      try {
        engine.current = new MLCEngine({ initProgressCallback });
        console.log("Initializing engine", engine.current);

        if (savedModel) {
          await loadModel(savedModel);
        }
      } catch (error) {
        handleError(error);
      }
    };

    initializeEngine();
  }, [initProgressCallback, loadModel, handleError]);

  const contextValue = useMemo<LLMContextType>(
    () => ({
      engine: engine.current,
      loadModel,
      askModel,
      isLoading,
      error,
      setError,
    }),
    [engine.current, loadModel, askModel, isLoading, error]
  );

  return (
    <LLMContext.Provider value={contextValue}>{children}</LLMContext.Provider>
  );
};
