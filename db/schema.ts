import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  nameEn: text("name_en").notNull(),
  nameTe: text("name_te").notNull(),
  descriptionEn: text("description_en").notNull().default(""),
  descriptionTe: text("description_te").notNull().default(""),
  price: integer("price").notNull(),
  category: text("category").notNull().default("Breakfast"),
  imageKey: text("image_key"),
  isAvailable: boolean("is_available").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  roleEn: text("role_en").notNull(),
  roleTe: text("role_te").notNull(),
  bioEn: text("bio_en").notNull().default(""),
  bioTe: text("bio_te").notNull().default(""),
  imageKey: text("image_key"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  authorName: text("author_name").notNull(),
  quoteEn: text("quote_en").notNull(),
  quoteTe: text("quote_te").notNull().default(""),
  rating: integer("rating").notNull().default(5),
  source: text("source").notNull().default("Customer"),
  imageKey: text("image_key"),
  isPublished: boolean("is_published").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
