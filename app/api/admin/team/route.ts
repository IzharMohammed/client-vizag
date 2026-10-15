import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { dbFirst, isDatabaseConfigured } from "@/lib/postgres";
import { getTeam } from "@/lib/records";

export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "Neon DATABASE_URL is not configured." },
      { status: 503 },
    );
  }
  return NextResponse.json({ members: await getTeam() });
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const body = (await request.json()) as Record<string, unknown>;
  if (!body.name || !body.roleEn || !body.roleTe) {
    return NextResponse.json(
      { error: "Name and both role translations are required" },
      { status: 400 },
    );
  }

  const created = await dbFirst<{ id: number }>(
    "INSERT INTO team_members (name,role_en,role_te,bio_en,bio_te,image_key,sort_order,created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id",
    [
      body.name,
      body.roleEn,
      body.roleTe,
      body.bioEn || "",
      body.bioTe || "",
      body.imageKey || null,
      Number(body.sortOrder) || 0,
      new Date().toISOString(),
    ],
  );
  return NextResponse.json({ ok: true, id: created?.id });
}
