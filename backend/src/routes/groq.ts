import { FastifyInstance } from "fastify";
import { askGroq } from "../services/groqServices";

export default async function groqRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/api/chat",
    {
      schema: {
        body: {
          type: "object",
          required: ["prompt"],
          properties: {
            prompt: { type: "string", minLength: 1, maxLength: 2000 },
          },
        },
      },
    },
    async (request, reply) => {
      const { prompt } = request.body as { prompt: string };

      try {
        const response = await askGroq(prompt);
        reply.send(response);
      } catch (error: any) {
        fastify.log.error(error);
        reply.status(500).send({ error: "Groq API error", details: error.message });
      }
    }
  );
}