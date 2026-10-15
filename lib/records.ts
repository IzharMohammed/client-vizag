import { dbQuery, isDatabaseConfigured } from "@/lib/postgres";
import { sampleMenu, sampleTeam, sampleTestimonials } from "@/lib/sample-data";
export { sampleMenu, sampleTeam, sampleTestimonials } from "@/lib/sample-data";

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

function testimonialCamel(row: Record<string, unknown>) {
  return {
    id: Number(row.id),
    authorName: String(row.author_name),
    quoteEn: String(row.quote_en),
    quoteTe: String(row.quote_te ?? ""),
    rating: Math.min(5, Math.max(1, Number(row.rating) || 5)),
    source: String(row.source ?? "Customer"),
    imageKey: row.image_key ? String(row.image_key) : null,
    isPublished: Boolean(row.is_published),
    sortOrder: Number(row.sort_order ?? 0),
  };
}

export async function getMenu(admin = false) {
  if (!isDatabaseConfigured()) return sampleMenu;
  const rows = await dbQuery<Record<string, unknown>>(
    `SELECT * FROM menu_items ${admin ? "" : "WHERE is_available = true"} ORDER BY sort_order, id`,
  );
  return rows.map(camel);
}

export async function getTeam() {
  if (!isDatabaseConfigured()) return sampleTeam;
  const rows = await dbQuery<Record<string, unknown>>(
    "SELECT * FROM team_members ORDER BY sort_order, id",
  );
  return rows.map(teamCamel);
}

export async function getTestimonials(admin = false) {
  if (!isDatabaseConfigured()) return admin ? [] : sampleTestimonials;
  const rows = await dbQuery<Record<string, unknown>>(
    `SELECT * FROM testimonials ${admin ? "" : "WHERE is_published = true"} ORDER BY sort_order, id`,
  );
  return rows.length || admin ? rows.map(testimonialCamel) : sampleTestimonials;
}
