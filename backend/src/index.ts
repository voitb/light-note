import Fastify from "fastify";
import cors from "@fastify/cors";
import groqRoutes from "./routes/groq";
import * as dotenv from "dotenv";

dotenv.config();dotenv.config();

const fastify = Fastify({ logger: true });

await fastify.register(cors, { origin: true });
await fastify.register(groqRoutes);

fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);
  reply.status(500).send({ error: "Internal server error" });
});

async function initialize() {
  try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
    console.log("Fastify server running on http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

initialize();