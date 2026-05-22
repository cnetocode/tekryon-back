import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const contacts = pgTable(
  "contacts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    company: text("company"),
    type: text("type"),
    message: text("message").notNull(),
    locale: text("locale"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("contacts_created_at_idx").on(t.createdAt)],
);
