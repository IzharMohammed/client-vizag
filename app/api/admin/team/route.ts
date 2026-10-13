import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { d1Execute, isD1Configured } from "@/lib/d1";
import { getTeam } from "@/lib/records";

export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  if (!isD1Configured()) {
    return NextResponse.json(
      { error: "Cloudflare D1 environment variables are not configured." },
      { status: 503 },
    );
  }
  return NextResponse.json({ members: await getTeam() });
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  if (!isD1Configured()) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const body = (await request.json()) as Record<string, unknown>;
  if (!body.name || !body.roleEn || !body.roleTe) {
    return NextResponse.json(
      { error: "Name and both role translations are required" },
      { status: 400 },
    );
  }

  const meta = await d1Execute(
    "INSERT INTO team_members (name,role_en,role_te,bio_en,bio_te,image_key,sort_order,created_at) VALUES (?,?,?,?,?,?,?,?)",
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
  return NextResponse.json({ ok: true, id: meta.last_row_id });
}
