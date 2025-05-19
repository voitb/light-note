import { useContext } from "react";
import { LLMContext } from "@/context/llm/llm-provider";

export function useLLMProvider() { 
    return useContext(LLMContext);
}