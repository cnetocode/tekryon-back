import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { db } from "../db/index.js";
import { contacts } from "../db/schema.js";

const contactBodySchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  company: z.string().max(200).optional().nullable(),
  type: z.enum(["sistema", "integracao", "ia", "consultoria", "outro"]).optional().nullable(),
  message: z.string().min(1).max(10_000),
  locale: z.enum(["pt", "en", "es"]).optional().nullable(),
});

export async function registerContactRoutes(app: FastifyInstance) {
  app.post("/v1/contact", async (request, reply) => {
    const parsed = contactBodySchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        error: "Validation failed",
        details: parsed.error.flatten(),
      });
    }
    const body = parsed.data;
    const [row] = await db
      .insert(contacts)
      .values({
        name: body.name,
        email: body.email,
        company: body.company ?? null,
        type: body.type ?? null,
        message: body.message,
        locale: body.locale ?? null,
      })
      .returning({ id: contacts.id });

    return reply.status(201).send({ id: row?.id });
  });
}
