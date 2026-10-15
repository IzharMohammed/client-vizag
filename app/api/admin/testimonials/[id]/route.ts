import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { dbExecute, dbFirst, isDatabaseConfigured } from "@/lib/postgres";
import { deleteImage, isR2Configured } from "@/lib/r2";

type ImageRow = { image_key: string | null };

function validId(value: string) {
  return /^\d+$/.test(value) && Number(value) > 0;
}

function cleanRating(value: unknown) {
  return Math.min(5, Math.max(1, Math.round(Number(value) || 5)));
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
    return NextResponse.json({ error: "Invalid testimonial" }, { status: 400 });
  }
  const body = (await request.json()) as Record<string, unknown>;
  if (!body.authorName || !body.quoteEn) {
    return NextResponse.json(
      { error: "Customer name and English testimonial are required" },
      { status: 400 },
    );
  }

  const old = await dbFirst<ImageRow>(
    "SELECT image_key FROM testimonials WHERE id=$1",
    [id],
  );
  if (old?.image_key && old.image_key !== body.imageKey && !isR2Configured()) {
    return NextResponse.json({ error: "R2 is not configured" }, { status: 503 });
  }

  await dbExecute(
    "UPDATE testimonials SET author_name=$1,quote_en=$2,quote_te=$3,rating=$4,source=$5,image_key=$6,is_published=$7,sort_order=$8 WHERE id=$9",
    [
      body.authorName,
      body.quoteEn,
      body.quoteTe || "",
      cleanRating(body.rating),
      body.source || "Customer",
      body.imageKey || null,
      body.isPublished !== false,
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
    return NextResponse.json({ error: "Invalid testimonial" }, { status: 400 });
  }
  const old = await dbFirst<ImageRow>(
    "SELECT image_key FROM testimonials WHERE id=$1",
    [id],
  );
  if (old?.image_key && !isR2Configured()) {
    return NextResponse.json({ error: "R2 is not configured" }, { status: 503 });
  }

  await dbExecute("DELETE FROM testimonials WHERE id=$1", [id]);
  await deleteImage(old?.image_key);
  return NextResponse.json({ ok: true });
}
