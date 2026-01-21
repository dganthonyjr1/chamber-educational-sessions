CREATE TABLE `pro_tips` (
	`id` int AUTO_INCREMENT NOT NULL,
	`problem` text NOT NULL,
	`solution` text NOT NULL,
	`category` varchar(100) NOT NULL,
	`difficulty` enum('beginner','intermediate','advanced') NOT NULL DEFAULT 'beginner',
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pro_tips_id` PRIMARY KEY(`id`)
);
