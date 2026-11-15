CREATE TABLE `app_settings` (
	`id` integer PRIMARY KEY NOT NULL,
	`theme_mode` text DEFAULT 'system' NOT NULL,
	`one_rm_formula` text DEFAULT 'epley' NOT NULL,
	`default_rest_seconds` integer DEFAULT 90 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `equipment` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `exercise_equipment` (
	`exercise_id` text NOT NULL,
	`equipment_id` text NOT NULL,
	PRIMARY KEY(`exercise_id`, `equipment_id`),
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`equipment_id`) REFERENCES `equipment`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `exercise_muscles` (
	`exercise_id` text NOT NULL,
	`muscle_group_id` text NOT NULL,
	`role` text NOT NULL,
	PRIMARY KEY(`exercise_id`, `muscle_group_id`),
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`muscle_group_id`) REFERENCES `muscle_groups`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `exercise_muscles_muscle_group_idx` ON `exercise_muscles` (`muscle_group_id`);--> statement-breakpoint
CREATE TABLE `exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`media_type` text NOT NULL,
	`media_key` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `muscle_groups` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`body_region` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `performance_standards` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`exercise_id` text NOT NULL,
	`sex` text NOT NULL,
	`body_weight_min_kg` real NOT NULL,
	`body_weight_max_kg` real NOT NULL,
	`level` text NOT NULL,
	`min_one_rm_kg` real NOT NULL,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `performance_standards_exercise_sex_idx` ON `performance_standards` (`exercise_id`,`sex`);--> statement-breakpoint
CREATE TABLE `program_session_templates` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`program_id` integer NOT NULL,
	`session_template_id` integer NOT NULL,
	`order_index` integer NOT NULL,
	`day_label` text,
	FOREIGN KEY (`program_id`) REFERENCES `programs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`session_template_id`) REFERENCES `session_templates`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `program_session_templates_program_idx` ON `program_session_templates` (`program_id`);--> statement-breakpoint
CREATE TABLE `programs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`split_type` text NOT NULL,
	`sessions_per_week` integer NOT NULL,
	`source` text NOT NULL,
	`notes` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `session_template_exercises` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`session_template_id` integer NOT NULL,
	`exercise_id` text NOT NULL,
	`order_index` integer NOT NULL,
	`rest_seconds_override` integer,
	FOREIGN KEY (`session_template_id`) REFERENCES `session_templates`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `session_template_exercises_template_idx` ON `session_template_exercises` (`session_template_id`);--> statement-breakpoint
CREATE TABLE `session_template_sets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`session_template_exercise_id` integer NOT NULL,
	`set_index` integer NOT NULL,
	`target_reps` integer NOT NULL,
	`target_weight_kg` real NOT NULL,
	FOREIGN KEY (`session_template_exercise_id`) REFERENCES `session_template_exercises`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `session_template_sets_exercise_idx` ON `session_template_sets` (`session_template_exercise_id`);--> statement-breakpoint
CREATE TABLE `session_templates` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`default_rest_seconds` integer NOT NULL,
	`notes` text
);
--> statement-breakpoint
CREATE TABLE `user_profile` (
	`id` integer PRIMARY KEY NOT NULL,
	`nickname` text NOT NULL,
	`birth_date` text NOT NULL,
	`sex` text NOT NULL,
	`height_cm` real NOT NULL,
	`body_weight_kg` real NOT NULL,
	`onboarding_completed_at` integer
);
--> statement-breakpoint
CREATE TABLE `workout_log_exercises` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`workout_log_id` integer NOT NULL,
	`exercise_id` text NOT NULL,
	`exercise_name_snapshot` text NOT NULL,
	`order_index` integer NOT NULL,
	`rest_seconds_used` integer NOT NULL,
	FOREIGN KEY (`workout_log_id`) REFERENCES `workout_logs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `workout_log_exercises_log_idx` ON `workout_log_exercises` (`workout_log_id`);--> statement-breakpoint
CREATE TABLE `workout_log_sets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`workout_log_exercise_id` integer NOT NULL,
	`set_index` integer NOT NULL,
	`target_reps` integer NOT NULL,
	`target_weight_kg` real NOT NULL,
	`actual_reps` integer,
	`actual_weight_kg` real,
	`is_completed` integer DEFAULT false NOT NULL,
	`completed_at` integer,
	FOREIGN KEY (`workout_log_exercise_id`) REFERENCES `workout_log_exercises`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `workout_log_sets_exercise_idx` ON `workout_log_sets` (`workout_log_exercise_id`);--> statement-breakpoint
CREATE TABLE `workout_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`session_template_id` integer,
	`template_name_snapshot` text NOT NULL,
	`program_id` integer,
	`status` text NOT NULL,
	`started_at` integer NOT NULL,
	`completed_at` integer,
	`runtime_state` text,
	FOREIGN KEY (`session_template_id`) REFERENCES `session_templates`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`program_id`) REFERENCES `programs`(`id`) ON UPDATE no action ON DELETE set null
);
