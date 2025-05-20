import { FastifyInstance } from "fastify";

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.get("/api/auth/callback", async (request, reply) => {
    try {
      const { token, error } = request.query as {
        token: string;
        error: string;
      };
      if (!token) {
        return reply.status(400).send({ error: "Invalid token" });
      }
      if (error) {
        reply.status(401).send({ error: "Unauthorized" });
      }
      // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      reply.status(401).send({ error: "Unauthorized" });
    }
  });
}
