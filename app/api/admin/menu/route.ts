import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { dbFirst, isDatabaseConfigured } from "@/lib/postgres";
import { getMenu } from "@/lib/records";

export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "Neon DATABASE_URL is not configured." },
      { status: 503 },
    );
  }
  return NextResponse.json({ items: await getMenu(true) });
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const body = (await request.json()) as Record<string, unknown>;
  if (!body.nameEn || !body.nameTe || !Number.isFinite(Number(body.price))) {
    return NextResponse.json(
      { error: "English name, Telugu name and price are required" },
      { status: 400 },
    );
  }

  const created = await dbFirst<{ id: number }>(
    "INSERT INTO menu_items (name_en,name_te,description_en,description_te,price,category,image_key,is_available,sort_order,created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id",
    [
      body.nameEn,
      body.nameTe,
      body.descriptionEn || "",
      body.descriptionTe || "",
      Math.round(Number(body.price)),
      body.category || "Breakfast",
      body.imageKey || null,
      body.isAvailable !== false,
      Number(body.sortOrder) || 0,
      new Date().toISOString(),
    ],
  );
  return NextResponse.json({ ok: true, id: created?.id });
}
