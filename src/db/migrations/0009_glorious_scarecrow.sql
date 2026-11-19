ALTER TABLE `app_settings` ADD `language` text DEFAULT 'fr' NOT NULL;--> statement-breakpoint
ALTER TABLE `equipment` ADD `name_en` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `exercises` ADD `description_en` text;--> statement-breakpoint
ALTER TABLE `muscle_groups` ADD `name_en` text DEFAULT '' NOT NULL;