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
    return NextResponse.json({ error: "Invalid team member" }, { status: 400 });
  }
  const body = (await request.json()) as Record<string, unknown>;
  const old = await d1First<ImageRow>(
    "SELECT image_key FROM team_members WHERE id=?",
    [id],
  );
  if (old?.image_key && old.image_key !== body.imageKey && !isR2Configured()) {
    return NextResponse.json({ error: "R2 is not configured" }, { status: 503 });
  }

  await d1Execute(
    "UPDATE team_members SET name=?,role_en=?,role_te=?,bio_en=?,bio_te=?,image_key=?,sort_order=? WHERE id=?",
    [
      body.name,
      body.roleEn,
      body.roleTe,
      body.bioEn || "",
      body.bioTe || "",
      body.imageKey || null,
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
    return NextResponse.json({ error: "Invalid team member" }, { status: 400 });
  }
  const old = await d1First<ImageRow>(
    "SELECT image_key FROM team_members WHERE id=?",
    [id],
  );
  if (old?.image_key && !isR2Configured()) {
    return NextResponse.json({ error: "R2 is not configured" }, { status: 503 });
  }

  await d1Execute("DELETE FROM team_members WHERE id=?", [id]);
  await deleteImage(old?.image_key);
  return NextResponse.json({ ok: true });
}
