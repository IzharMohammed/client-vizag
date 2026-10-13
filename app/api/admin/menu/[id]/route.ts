import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { d1Execute, d1First, isD1Configured } from "@/lib/d1";
import { deleteImage, isR2Configured } from "@/lib/r2";

type ImageRow = { image_key: string | null };

function validId(value: string) {
  return /^\d+$/.test(value) && Number(value) > 0;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  if (!isD1Configured()) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const { id } = await params;
  if (!validId(id)) {
    return NextResponse.json({ error: "Invalid menu item" }, { status: 400 });
  }
  const body = (await request.json()) as Record<string, unknown>;
  const old = await d1First<ImageRow>(
    "SELECT image_key FROM menu_items WHERE id=?",
    [id],
  );
  if (old?.image_key && old.image_key !== body.imageKey && !isR2Configured()) {
    return NextResponse.json({ error: "R2 is not configured" }, { status: 503 });
  }

  await d1Execute(
    "UPDATE menu_items SET name_en=?,name_te=?,description_en=?,description_te=?,price=?,category=?,image_key=?,is_available=?,sort_order=? WHERE id=?",
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
      id,
    ],
  );
  if (old?.image_key && old.image_key !== body.imageKey) {
    await deleteImage(old.image_key);
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  if (!isD1Configured()) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const { id } = await params;
  if (!validId(id)) {
    return NextResponse.json({ error: "Invalid menu item" }, { status: 400 });
  }
  const old = await d1First<ImageRow>(
    "SELECT image_key FROM menu_items WHERE id=?",
    [id],
  );
  if (old?.image_key && !isR2Configured()) {
    return NextResponse.json({ error: "R2 is not configured" }, { status: 503 });
  }

  await d1Execute("DELETE FROM menu_items WHERE id=?", [id]);
  await deleteImage(old?.image_key);
  return NextResponse.json({ ok: true });
}
