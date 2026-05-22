import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema.js";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
});

export const db = drizzle(pool, { schema });
export { pool };

export async function checkDb(): Promise<boolean> {
  const c = await pool.connect();
  try {
    await c.query("select 1");
    return true;
  } finally {
    c.release();
  }
}
