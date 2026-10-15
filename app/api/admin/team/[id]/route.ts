import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { dbExecute, dbFirst, isDatabaseConfigured } from "@/lib/postgres";
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
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const { id } = await params;
  if (!validId(id)) {
    return NextResponse.json({ error: "Invalid team member" }, { status: 400 });
  }
  const body = (await request.json()) as Record<string, unknown>;
  const old = await dbFirst<ImageRow>(
    "SELECT image_key FROM team_members WHERE id=$1",
    [id],
  );
  if (old?.image_key && old.image_key !== body.imageKey && !isR2Configured()) {
    return NextResponse.json({ error: "R2 is not configured" }, { status: 503 });
  }

  await dbExecute(
    "UPDATE team_members SET name=$1,role_en=$2,role_te=$3,bio_en=$4,bio_te=$5,image_key=$6,sort_order=$7 WHERE id=$8",
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
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const { id } = await params;
  if (!validId(id)) {
    return NextResponse.json({ error: "Invalid team member" }, { status: 400 });
  }
  const old = await dbFirst<ImageRow>(
    "SELECT image_key FROM team_members WHERE id=$1",
    [id],
  );
  if (old?.image_key && !isR2Configured()) {
    return NextResponse.json({ error: "R2 is not configured" }, { status: 503 });
  }

  await dbExecute("DELETE FROM team_members WHERE id=$1", [id]);
  await deleteImage(old?.image_key);
  return NextResponse.json({ ok: true });
}
