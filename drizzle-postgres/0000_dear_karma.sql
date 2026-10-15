CREATE TABLE "menu_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"name_en" text NOT NULL,
	"name_te" text NOT NULL,
	"description_en" text DEFAULT '' NOT NULL,
	"description_te" text DEFAULT '' NOT NULL,
	"price" integer NOT NULL,
	"category" text DEFAULT 'Breakfast' NOT NULL,
	"image_key" text,
	"is_available" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "team_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"role_en" text NOT NULL,
	"role_te" text NOT NULL,
	"bio_en" text DEFAULT '' NOT NULL,
	"bio_te" text DEFAULT '' NOT NULL,
	"image_key" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" serial PRIMARY KEY NOT NULL,
	"author_name" text NOT NULL,
	"quote_en" text NOT NULL,
	"quote_te" text DEFAULT '' NOT NULL,
	"rating" integer DEFAULT 5 NOT NULL,
	"source" text DEFAULT 'Customer' NOT NULL,
	"image_key" text,
	"is_published" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
