-- Executável manualmente no PostgreSQL (equivalente à primeira migration do Drizzle).
-- Uso: psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f db/sql/0000_schema.sql

CREATE TABLE IF NOT EXISTS "contacts" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" text NOT NULL,
  "email" text NOT NULL,
  "company" text,
  "type" text,
  "message" text NOT NULL,
  "locale" text,
  "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "contacts_created_at_idx" ON "contacts" ("created_at");
