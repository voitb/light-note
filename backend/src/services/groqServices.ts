import Groq from "groq-sdk";

let groq: Groq | null = null;

const initializeGroq = () => {
  if (!groq) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groq;
};

export async function askGroq(prompt: string) {
  const groqClient = initializeGroq();
  return groqClient.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama3-70b-8192",
  });
}
