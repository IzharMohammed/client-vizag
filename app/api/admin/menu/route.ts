import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { d1Execute, isD1Configured } from "@/lib/d1";
import { getMenu } from "@/lib/records";

export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  if (!isD1Configured()) {
    return NextResponse.json(
      { error: "Cloudflare D1 environment variables are not configured." },
      { status: 503 },
    );
  }
  return NextResponse.json({ items: await getMenu(true) });
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  if (!isD1Configured()) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const body = (await request.json()) as Record<string, unknown>;
  if (!body.nameEn || !body.nameTe || !Number.isFinite(Number(body.price))) {
    return NextResponse.json(
      { error: "English name, Telugu name and price are required" },
      { status: 400 },
    );
  }

  const meta = await d1Execute(
    "INSERT INTO menu_items (name_en,name_te,description_en,description_te,price,category,image_key,is_available,sort_order,created_at) VALUES (?,?,?,?,?,?,?,?,?,?)",
    [
      body.nameEn,
      body.nameTe,
      body.descriptionEn || "",
      body.descriptionTe || "",
      Math.round(Number(body.price)),
      body.category || "Breakfast",
      body.imageKey || null,
      body.isAvailable === false ? 0 : 1,
      Number(body.sortOrder) || 0,
      new Date().toISOString(),
    ],
  );
  return NextResponse.json({ ok: true, id: meta.last_row_id });
}
