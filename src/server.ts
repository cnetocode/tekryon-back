import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import { loadEnv } from "./env.js";
import { checkDb } from "./db/index.js";
import { registerContactRoutes } from "./routes/contact.js";

const env = loadEnv();

const app = Fastify({
  logger: env.NODE_ENV === "development",
});

await app.register(helmet, { global: true });
await app.register(cors, {
  origin: env.CORS_ORIGIN.split(",").map((s) => s.trim()),
  methods: ["GET", "POST", "OPTIONS"],
});

app.get("/health", async () => ({ status: "ok" as const }));

app.get("/ready", async (_req, reply) => {
  try {
    const ok = await checkDb();
    if (!ok) return reply.status(503).send({ status: "unavailable" });
    return { status: "ready" as const };
  } catch {
    return reply.status(503).send({ status: "unavailable" });
  }
});

await app.register(async (scope) => {
  await scope.register(rateLimit, {
    max: 10,
    timeWindow: "1 minute",
  });
  await registerContactRoutes(scope);
});

const port = env.PORT;
const host = "0.0.0.0";

try {
  await app.listen({ port, host });
  console.log(`API listening on http://${host}:${port}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
