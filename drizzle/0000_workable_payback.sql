CREATE TABLE `menu_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name_en` text NOT NULL,
	`name_te` text NOT NULL,
	`description_en` text DEFAULT '' NOT NULL,
	`description_te` text DEFAULT '' NOT NULL,
	`price` integer NOT NULL,
	`category` text DEFAULT 'Breakfast' NOT NULL,
	`image_key` text,
	`is_available` integer DEFAULT true NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `team_members` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`role_en` text NOT NULL,
	`role_te` text NOT NULL,
	`bio_en` text DEFAULT '' NOT NULL,
	`bio_te` text DEFAULT '' NOT NULL,
	`image_key` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL
);
