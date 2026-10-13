import { NextRequest, NextResponse } from "next/server"; import { clearSession, isAdmin } from "@/lib/admin-auth";
export async function GET(request: NextRequest) { return NextResponse.json({ authenticated: await isAdmin(request) }); }
export async function DELETE() { return clearSession(); }
