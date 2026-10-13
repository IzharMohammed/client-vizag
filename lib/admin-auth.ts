import { NextRequest, NextResponse } from "next/server";
import { env } from "cloudflare:workers";

const encoder = new TextEncoder();
const cookieName = "put_admin";
function b64(bytes: Uint8Array) { return btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", ""); }
function fromB64(value: string) { const raw = atob(value.replaceAll("-", "+").replaceAll("_", "/")); return Uint8Array.from(raw, c => c.charCodeAt(0)); }
async function pbkdf2(password: string, salt: Uint8Array, iterations: number) { const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]); return new Uint8Array(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: salt.buffer as ArrayBuffer, iterations }, key, 256)); }
function equal(a: Uint8Array, b: Uint8Array) { if (a.length !== b.length) return false; let result = 0; for (let i = 0; i < a.length; i++) result |= a[i] ^ b[i]; return result === 0; }
async function sign(value: string) { const key = await crypto.subtle.importKey("raw", encoder.encode(env.ADMIN_SESSION_SECRET || ""), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]); return b64(new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(value)))); }
export async function verifyPassword(password: string) { const [iterationsRaw, saltRaw, hashRaw] = (env.ADMIN_PASSWORD_HASH || "").split("."); if (!iterationsRaw || !saltRaw || !hashRaw) return false; return equal(await pbkdf2(password, fromB64(saltRaw), Number(iterationsRaw)), fromB64(hashRaw)); }
export async function createSessionResponse(data: unknown) { const expiry = Date.now() + 1000 * 60 * 60 * 12; const payload = `admin.${expiry}`; const token = `${payload}.${await sign(payload)}`; const response = NextResponse.json(data); response.cookies.set(cookieName, token, { httpOnly: true, secure: true, sameSite: "strict", path: "/", expires: new Date(expiry) }); return response; }
export async function isAdmin(request: NextRequest) { if (!env.ADMIN_SESSION_SECRET) return false; const token = request.cookies.get(cookieName)?.value; if (!token) return false; const parts = token.split("."); if (parts.length !== 3 || parts[0] !== "admin" || Number(parts[1]) < Date.now()) return false; return equal(encoder.encode(parts[2]), encoder.encode(await sign(`${parts[0]}.${parts[1]}`))); }
export async function requireAdmin(request: NextRequest) { return (await isAdmin(request)) ? null : NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
export function clearSession() { const r = NextResponse.json({ ok: true }); r.cookies.set(cookieName, "", { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: 0 }); return r; }
