ALTER TABLE `pro_tips` ADD `lessonId` int NOT NULL;--> statement-breakpoint
ALTER TABLE `pro_tips` ADD `order` int DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `pro_tips` DROP COLUMN `category`;--> statement-breakpoint
ALTER TABLE `pro_tips` DROP COLUMN `difficulty`;--> statement-breakpoint
ALTER TABLE `pro_tips` DROP COLUMN `isActive`;