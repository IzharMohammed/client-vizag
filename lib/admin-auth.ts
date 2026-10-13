import { createHmac, pbkdf2Sync, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

const cookieName = "put_admin";

function sign(value: string) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not configured.");
  return createHmac("sha256", secret).update(value).digest("base64url");
}

export async function verifyPassword(password: string) {
  const [iterationsRaw, saltRaw, hashRaw] = (
    process.env.ADMIN_PASSWORD_HASH || ""
  ).split(".");
  const iterations = Number(iterationsRaw);
  if (!iterations || !saltRaw || !hashRaw) return false;

  const expected = Buffer.from(hashRaw, "base64url");
  const actual = pbkdf2Sync(
    password,
    Buffer.from(saltRaw, "base64url"),
    iterations,
    expected.length,
    "sha256",
  );
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export async function createSessionResponse(data: unknown) {
  const expiry = Date.now() + 1000 * 60 * 60 * 12;
  const payload = `admin.${expiry}`;
  const token = `${payload}.${sign(payload)}`;
  const response = NextResponse.json(data);
  response.cookies.set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: new Date(expiry),
  });
  return response;
}

export async function isAdmin(request: NextRequest) {
  if (!process.env.ADMIN_SESSION_SECRET) return false;
  const token = request.cookies.get(cookieName)?.value;
  if (!token) return false;
  const parts = token.split(".");
  if (
    parts.length !== 3 ||
    parts[0] !== "admin" ||
    Number(parts[1]) < Date.now()
  ) {
    return false;
  }

  const actual = Buffer.from(parts[2]);
  const expected = Buffer.from(sign(`${parts[0]}.${parts[1]}`));
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function requireAdmin(request: NextRequest) {
  return (await isAdmin(request))
    ? null
    : NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function clearSession() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(cookieName, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return response;
}
