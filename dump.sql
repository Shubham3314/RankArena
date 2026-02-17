-- RankArena schema dump

CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NULL,
  `full_name` varchar(255) NULL,
  `role` enum('guest','normal','vip','admin') NOT NULL DEFAULT 'normal',
  `is_active` tinyint NOT NULL DEFAULT 1,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  UNIQUE INDEX `IDX_users_email` (`email`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE `refresh_tokens` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `token` varchar(512) NOT NULL,
  `expires_at` timestamp NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  INDEX `IDX_refresh_tokens_user_id` (`user_id`),
  CONSTRAINT `FK_refresh_tokens_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `contests` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text NULL,
  `access_level` enum('normal','vip') NOT NULL DEFAULT 'normal',
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `prize_description` text NULL,
  `is_published` tinyint NOT NULL DEFAULT 0,
  `created_by` bigint NULL,
  `awards_computed_at` timestamp NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  INDEX `IDX_contests_created_by` (`created_by`),
  CONSTRAINT `FK_contests_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB;

CREATE TABLE `questions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `contest_id` bigint NOT NULL,
  `type` enum('single','multi','truefalse') NOT NULL,
  `text` text NOT NULL,
  `points` int NOT NULL DEFAULT 1,
  `order_index` int NOT NULL DEFAULT 0,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  INDEX `IDX_questions_contest_id` (`contest_id`),
  CONSTRAINT `FK_questions_contest` FOREIGN KEY (`contest_id`) REFERENCES `contests` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `options` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `question_id` bigint NOT NULL,
  `text` varchar(1000) NOT NULL,
  `is_correct` tinyint NOT NULL DEFAULT 0,
  `order_index` int NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  INDEX `IDX_options_question_id` (`question_id`),
  CONSTRAINT `FK_options_question` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `contest_participants` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `contest_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `joined_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `submitted_at` timestamp NULL,
  `status` enum('in_progress','submitted') NOT NULL DEFAULT 'in_progress',
  `score` int NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `UQ_contest_user` (`contest_id`,`user_id`),
  INDEX `IDX_participants_contest` (`contest_id`),
  INDEX `IDX_participants_user` (`user_id`),
  CONSTRAINT `FK_participants_contest` FOREIGN KEY (`contest_id`) REFERENCES `contests` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_participants_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `answers` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `participant_id` bigint NOT NULL,
  `question_id` bigint NOT NULL,
  `option_id` bigint NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  INDEX `IDX_answers_participant` (`participant_id`),
  INDEX `IDX_answers_question` (`question_id`),
  INDEX `IDX_answers_option` (`option_id`),
  CONSTRAINT `FK_answers_participant` FOREIGN KEY (`participant_id`) REFERENCES `contest_participants` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_answers_question` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_answers_option` FOREIGN KEY (`option_id`) REFERENCES `options` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `prize_awards` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `contest_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `awarded_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `prize_details` text NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `UQ_prize_contest_user` (`contest_id`,`user_id`),
  INDEX `IDX_prize_awards_contest` (`contest_id`),
  INDEX `IDX_prize_awards_user` (`user_id`),
  CONSTRAINT `FK_prize_awards_contest` FOREIGN KEY (`contest_id`) REFERENCES `contests` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_prize_awards_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `leaderboard_entries` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `contest_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `score` int NOT NULL,
  `rank` int NULL,
  `computed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `IDX_leaderboard_contest` (`contest_id`),
  INDEX `IDX_leaderboard_user` (`user_id`),
  CONSTRAINT `FK_leaderboard_contest` FOREIGN KEY (`contest_id`) REFERENCES `contests` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_leaderboard_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;
