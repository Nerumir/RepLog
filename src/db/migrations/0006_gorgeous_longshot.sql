CREATE TABLE `unlocked_achievements` (
	`id` text PRIMARY KEY NOT NULL,
	`unlocked_at` integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE `attendance_progress` ADD `ever_penalized` integer DEFAULT false NOT NULL;