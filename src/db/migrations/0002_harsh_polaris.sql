CREATE TABLE `attendance_biome_sessions` (
	`biome_index` integer PRIMARY KEY NOT NULL,
	`total_sessions` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `attendance_progress` (
	`id` integer PRIMARY KEY NOT NULL,
	`biome_index` integer DEFAULT 0 NOT NULL,
	`point_in_biome` integer DEFAULT 0 NOT NULL,
	`penalty_threshold_days` integer,
	`last_session_completed_at` integer,
	`last_penalty_check_at` integer
);
