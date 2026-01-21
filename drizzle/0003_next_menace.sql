ALTER TABLE `organizations` ADD `slug` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `organizations` ADD `signupUrl` varchar(512);--> statement-breakpoint
ALTER TABLE `organizations` ADD `primaryColor` varchar(7);--> statement-breakpoint
ALTER TABLE `organizations` ADD CONSTRAINT `organizations_slug_unique` UNIQUE(`slug`);