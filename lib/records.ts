import { d1Query, isD1Configured } from "@/lib/d1";
import { sampleMenu, sampleTeam } from "@/lib/sample-data";
export { sampleMenu, sampleTeam } from "@/lib/sample-data";

function camel(row: Record<string, unknown>) {
  return {
    id: Number(row.id),
    nameEn: String(row.name_en),
    nameTe: String(row.name_te),
    descriptionEn: String(row.description_en ?? ""),
    descriptionTe: String(row.description_te ?? ""),
    price: Number(row.price),
    category: String(row.category),
    imageKey: row.image_key ? String(row.image_key) : null,
    isAvailable: Boolean(row.is_available),
    sortOrder: Number(row.sort_order ?? 0),
  };
}

function teamCamel(row: Record<string, unknown>) {
  return {
    id: Number(row.id),
    name: String(row.name),
    roleEn: String(row.role_en),
    roleTe: String(row.role_te),
    bioEn: String(row.bio_en ?? ""),
    bioTe: String(row.bio_te ?? ""),
    imageKey: row.image_key ? String(row.image_key) : null,
    sortOrder: Number(row.sort_order ?? 0),
  };
}

export async function getMenu(admin = false) {
  if (!isD1Configured()) return sampleMenu;
  const rows = await d1Query<Record<string, unknown>>(
    `SELECT * FROM menu_items ${admin ? "" : "WHERE is_available = 1"} ORDER BY sort_order, id`,
  );
  return rows.map(camel);
}

export async function getTeam() {
  if (!isD1Configured()) return sampleTeam;
  const rows = await d1Query<Record<string, unknown>>(
    "SELECT * FROM team_members ORDER BY sort_order, id",
  );
  return rows.map(teamCamel);
}
