import { NextResponse } from "next/server";
import { getTestimonials } from "@/lib/records";

export async function GET() {
  return NextResponse.json({ testimonials: await getTestimonials() });
}
