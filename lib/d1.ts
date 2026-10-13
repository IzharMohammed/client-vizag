type D1Meta = {
  changes?: number;
  duration?: number;
  last_row_id?: number;
  rows_read?: number;
  rows_written?: number;
};

type D1StatementResult<T> = {
  success: boolean;
  results?: T[];
  meta?: D1Meta;
  error?: string;
};

type D1Envelope<T> = {
  success: boolean;
  result?: D1StatementResult<T>[];
  errors?: Array<{ message?: string }>;
};

export function isD1Configured() {
  return Boolean(
    process.env.CLOUDFLARE_ACCOUNT_ID &&
      process.env.CLOUDFLARE_D1_DATABASE_ID &&
      process.env.CLOUDFLARE_API_TOKEN,
  );
}

function d1Config() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !databaseId || !apiToken) {
    throw new Error(
      "Cloudflare D1 is not configured. Set CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_D1_DATABASE_ID, and CLOUDFLARE_API_TOKEN.",
    );
  }

  return { accountId, databaseId, apiToken };
}

async function runD1<T>(sql: string, params: unknown[] = []) {
  const { accountId, databaseId, apiToken } = d1Config();
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/d1/database/${encodeURIComponent(databaseId)}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql, params }),
      cache: "no-store",
    },
  );

  const payload = (await response.json()) as D1Envelope<T>;
  const statement = payload.result?.[0];
  if (!response.ok || !payload.success || !statement?.success) {
    const detail =
      statement?.error || payload.errors?.[0]?.message || `HTTP ${response.status}`;
    throw new Error(`Cloudflare D1 query failed: ${detail}`);
  }

  return statement;
}

export async function d1Query<T extends Record<string, unknown>>(
  sql: string,
  params: unknown[] = [],
) {
  const result = await runD1<T>(sql, params);
  return result.results ?? [];
}

export async function d1First<T extends Record<string, unknown>>(
  sql: string,
  params: unknown[] = [],
) {
  const rows = await d1Query<T>(sql, params);
  return rows[0] ?? null;
}

export async function d1Execute(sql: string, params: unknown[] = []) {
  const result = await runD1<Record<string, unknown>>(sql, params);
  return result.meta ?? {};
}
