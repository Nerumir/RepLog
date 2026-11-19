ALTER TABLE `app_settings` ADD `premium_unlocked` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `app_settings` ADD `premium_unlocked_at` integer;--> statement-breakpoint
ALTER TABLE `app_settings` ADD `premium_source` text;