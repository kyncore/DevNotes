-- This schema can be used for both the OOP and Functional versions of the Guestbook.

CREATE DATABASE IF NOT EXISTS `guestbook`;

USE `guestbook`;

CREATE TABLE IF NOT EXISTS `comments` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `comment` TEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Optional: Add some initial data
INSERT INTO `comments` (`name`, `comment`) VALUES
('Alice', 'This is the first comment!'),
('Bob', 'Hello from the guestbook!');
