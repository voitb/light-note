import Fastify from "fastify";
import cors from "@fastify/cors";
import groqRoutes from "./routes/groq";
import * as dotenv from "dotenv";

dotenv.config();

const fastify = Fastify({ logger: true });

const port = parseInt(process.env.PORT || "3000", 10);
const host = process.env.HOST || "0.0.0.0";

await fastify.register(cors, { origin: true });
await fastify.register(groqRoutes);

fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);
  reply.status(500).send({ error: "Internal server error" });
});

async function initialize() {
  try {
    await fastify.listen({ port, host });
    console.log(`Fastify server running on http://${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

initialize();