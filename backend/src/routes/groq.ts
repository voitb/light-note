import { FastifyInstance } from "fastify";
import { askGroq } from "../services/groqServices";
import { ChatCompletionMessage } from "groq-sdk/resources/chat/completions";

export default async function groqRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/api/chat",
    {
      schema: {
        body: {
          type: "object",
          required: ["messages"],
          properties: {
            messages: { 
              type: "array",
              items: {
                type: "object",
                required: ["role", "content"],
                properties: {
                  role: { type: "string", enum: ["system", "user", "assistant"] },
                  content: { type: "string" }
                }
              }
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { messages } = request.body as { messages: ChatCompletionMessage[] };

      try {
        const response = await askGroq(messages);
        reply.send(response);
      } catch (error: any) {
        fastify.log.error(error);
        reply.status(500).send({ error: "Groq API error", details: error.message });
      }
    }
  );
}