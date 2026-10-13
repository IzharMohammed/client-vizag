import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { isR2Configured, putImage } from "@/lib/r2";

export const runtime = "nodejs";

const allowedTypes = new Set([
  "image/avif",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  if (!isR2Configured()) {
    return NextResponse.json({ error: "R2 is not configured" }, { status: 503 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (
    !(file instanceof File) ||
    !allowedTypes.has(file.type) ||
    file.size > 5_000_000
  ) {
    return NextResponse.json(
      { error: "Choose a JPG, PNG, WebP, AVIF or GIF image smaller than 5 MB" },
      { status: 400 },
    );
  }

  const extension =
    file.name.split(".").pop()?.replace(/[^a-z0-9]/gi, "").toLowerCase() ||
    "jpg";
  const key = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
  await putImage(key, file);
  return NextResponse.json({
    key,
    url: `/api/images/${encodeURIComponent(key)}`,
  });
}
