import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!apiKey || !placeId) {
    return NextResponse.json({ configured: false, reviews: [] });
  }

  const response = await fetch(
    `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
    {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "displayName,rating,userRatingCount,reviews,googleMapsUri",
      },
      next: { revalidate: 3600 },
    },
  );
  if (!response.ok) {
    return NextResponse.json(
      {
        configured: true,
        error: "Google reviews are temporarily unavailable",
        reviews: [],
      },
      { status: 502 },
    );
  }
  const data = (await response.json()) as Record<string, unknown>;
  return NextResponse.json({ configured: true, ...data });
}
