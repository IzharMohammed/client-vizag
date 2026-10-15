import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let cachedClient: NeonQueryFunction<false, false> | undefined;

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

function database() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("Neon is not configured. Set DATABASE_URL.");
  }
  cachedClient ??= neon(connectionString);
  return cachedClient;
}

export async function dbQuery<T extends Record<string, unknown>>(
  query: string,
  params: unknown[] = [],
) {
  return (await database().query(query, params)) as T[];
}

export async function dbFirst<T extends Record<string, unknown>>(
  query: string,
  params: unknown[] = [],
) {
  const rows = await dbQuery<T>(query, params);
  return rows[0] ?? null;
}

export async function dbExecute(query: string, params: unknown[] = []) {
  await database().query(query, params);
}
