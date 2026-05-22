import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required");
  }
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);
  const migrationsFolder = path.join(__dirname, "../../drizzle");
  await migrate(db, { migrationsFolder });
  await pool.end();
  console.log("Migrations applied from", migrationsFolder);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
