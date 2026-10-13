import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const menuItems = sqliteTable("menu_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nameEn: text("name_en").notNull(), nameTe: text("name_te").notNull(),
  descriptionEn: text("description_en").notNull().default(""), descriptionTe: text("description_te").notNull().default(""),
  price: integer("price").notNull(), category: text("category").notNull().default("Breakfast"),
  imageKey: text("image_key"), isAvailable: integer("is_available", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0), createdAt: text("created_at").notNull(),
});

export const teamMembers = sqliteTable("team_members", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(), roleEn: text("role_en").notNull(), roleTe: text("role_te").notNull(),
  bioEn: text("bio_en").notNull().default(""), bioTe: text("bio_te").notNull().default(""),
  imageKey: text("image_key"), sortOrder: integer("sort_order").notNull().default(0), createdAt: text("created_at").notNull(),
});
