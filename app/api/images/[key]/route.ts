import { NextRequest, NextResponse } from "next/server";
import { getImage, isR2Configured, isSafeObjectKey } from "@/lib/r2";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ key: string }> },
) {
  if (!isR2Configured()) {
    return new NextResponse("Image storage is not configured", { status: 503 });
  }
  const { key: encodedKey } = await params;
  const key = decodeURIComponent(encodedKey);
  if (!isSafeObjectKey(key)) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const object = await getImage(key);
    if (!object) return new NextResponse("Not found", { status: 404 });
    return new NextResponse(Buffer.from(object.bytes), {
      headers: {
        "Content-Type": object.contentType,
        "Cache-Control":
          object.cacheControl || "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
        ...(object.etag ? { ETag: object.etag } : {}),
      },
    });
  } catch (error) {
    const name = error instanceof Error ? error.name : "";
    if (name === "NoSuchKey" || name === "NotFound") {
      return new NextResponse("Not found", { status: 404 });
    }
    throw error;
  }
}
