import { NextResponse } from "next/server"; import { getTeam } from "@/lib/records";
export async function GET() { const members = await getTeam(); return NextResponse.json({ members }); }
