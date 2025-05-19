import Groq from "groq-sdk";  
import { ChatCompletionMessage } from "groq-sdk/resources/chat/completions";

let groq: Groq | null = null;

const initializeGroq = () => {
  if (!groq) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groq;
};
 

export async function askGroq(messages: ChatCompletionMessage[]) {
  const groqClient = initializeGroq();
  return groqClient.chat.completions.create({
    messages,
    model: "llama3-70b-8192",
  });
}
