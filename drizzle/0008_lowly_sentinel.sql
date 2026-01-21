ALTER TABLE `organizations` MODIFY COLUMN `slug` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `organizations` MODIFY COLUMN `website` text;--> statement-breakpoint
ALTER TABLE `organizations` MODIFY COLUMN `signupUrl` text;--> statement-breakpoint
ALTER TABLE `organizations` ADD `nameEs` varchar(255);--> statement-breakpoint
ALTER TABLE `organizations` ADD `descriptionEs` text;