import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { dbFirst, isDatabaseConfigured } from "@/lib/postgres";
import { getTestimonials } from "@/lib/records";

function cleanRating(value: unknown) {
  return Math.min(5, Math.max(1, Math.round(Number(value) || 5)));
}

export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "Neon DATABASE_URL is not configured." },
      { status: 503 },
    );
  }
  return NextResponse.json({ testimonials: await getTestimonials(true) });
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const body = (await request.json()) as Record<string, unknown>;
  if (!body.authorName || !body.quoteEn) {
    return NextResponse.json(
      { error: "Customer name and English testimonial are required" },
      { status: 400 },
    );
  }

  const created = await dbFirst<{ id: number }>(
    "INSERT INTO testimonials (author_name,quote_en,quote_te,rating,source,image_key,is_published,sort_order,created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id",
    [
      body.authorName,
      body.quoteEn,
      body.quoteTe || "",
      cleanRating(body.rating),
      body.source || "Customer",
      body.imageKey || null,
      body.isPublished !== false,
      Number(body.sortOrder) || 0,
      new Date().toISOString(),
    ],
  );
  return NextResponse.json({ ok: true, id: created?.id });
}
