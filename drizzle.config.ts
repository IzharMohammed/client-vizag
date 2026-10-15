import { defineConfig } from "drizzle-kit";
import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";

for (const path of [".env.local", ".env"]) {
  if (existsSync(path)) {
    loadEnvFile(path);
    break;
  }
}

const databaseUrl = process.env.DATABASE_URL;

export default defineConfig({
  out: "./drizzle-postgres",
  schema: "./db/schema.ts",
  dialect: "postgresql",
  ...(databaseUrl ? { dbCredentials: { url: databaseUrl } } : {}),
});
