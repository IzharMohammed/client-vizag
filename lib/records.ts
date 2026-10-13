import { env } from "cloudflare:workers";
import { sampleMenu, sampleTeam } from "@/lib/sample-data";
export { sampleMenu, sampleTeam } from "@/lib/sample-data";
function camel(row: Record<string, unknown>) { return { id: row.id, nameEn: row.name_en, nameTe: row.name_te, descriptionEn: row.description_en, descriptionTe: row.description_te, price: row.price, category: row.category, imageKey: row.image_key, isAvailable: Boolean(row.is_available), sortOrder: row.sort_order }; }
function teamCamel(row: Record<string, unknown>) { return { id: row.id, name: row.name, roleEn: row.role_en, roleTe: row.role_te, bioEn: row.bio_en, bioTe: row.bio_te, imageKey: row.image_key, sortOrder: row.sort_order }; }
export async function getMenu(admin = false) { if (!env.DB) return sampleMenu; const result = await env.DB.prepare(`SELECT * FROM menu_items ${admin ? "" : "WHERE is_available = 1"} ORDER BY sort_order, id`).all(); return result.results.map(r => camel(r as Record<string, unknown>)); }
export async function getTeam() { if (!env.DB) return sampleTeam; const result = await env.DB.prepare("SELECT * FROM team_members ORDER BY sort_order, id").all(); return result.results.map(r => teamCamel(r as Record<string, unknown>)); }
