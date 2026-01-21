CREATE TABLE `bonus_content` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`fileUrl` text NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`requiredCoursesCompleted` int NOT NULL DEFAULT 4,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bonus_content_id` PRIMARY KEY(`id`)
);
