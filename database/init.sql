-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema fitness_tracker
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema fitness_tracker
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `fitness_tracker` DEFAULT CHARACTER SET utf8 ;
USE `fitness_tracker` ;

-- -----------------------------------------------------
-- Table `fitness_tracker`.`Users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fitness_tracker`.`Users` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(20) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `fname` VARCHAR(35) NOT NULL,
  `lname` VARCHAR(35) NOT NULL,
  `dob` DATE NOT NULL,
  `height_ft` DECIMAL(3, 1) NOT NULL,
  `weight_lbs` DECIMAL(6, 2) NOT NULL,
  `gender` ENUM("Male", "Female", "Other") NOT NULL,
  `profile_pic` VARCHAR(255) NULL,
  `occupation` VARCHAR(45) NULL,
  `created_at` DATETIME NOT NULL,
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE,
  PRIMARY KEY (`user_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `fitness_tracker`.`Food_Entries`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fitness_tracker`.`Food_Entries` (
  `food_entries_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `food_name` VARCHAR(255) NOT NULL,
  `total_calories` INT NOT NULL,
  `meal_type` ENUM("Breakfast", "Lunch", "Dinner", "Snack") NOT NULL,
  `created_at` DATETIME NOT NULL,
  PRIMARY KEY (`food_entries_id`),
  INDEX `food_entries_fk_users_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `food_entries_fk_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `fitness_tracker`.`Users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `fitness_tracker`.`Workout_Logs`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fitness_tracker`.`Workout_Logs` (
  `workout_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `workout_type` ENUM("Running", "Swimming", "Biking", "Walking", "Strength", "Yoga", "Other") NOT NULL,
  `calories_burned` INT NOT NULL,
  `duration_min` INT NOT NULL,
  `created_at` DATETIME NOT NULL,
  PRIMARY KEY (`workout_id`),
  INDEX `workout_logs_fk_users_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `workout_logs_fk_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `fitness_tracker`.`Users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `fitness_tracker`.`Goals`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fitness_tracker`.`Goals` (
  `goal_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `goal_title` VARCHAR(255) NOT NULL,
  `goal_type` ENUM("Weight Loss", "Strength Gain", "Cardio Endurance", "Flexibility", "Nutrition", "Overall Health", "Other") NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NULL,
  `status` ENUM("Active", "Completed", "Abandoned") NOT NULL,
  PRIMARY KEY (`goal_id`),
  INDEX `goals_fk_users_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `goals_fk_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `fitness_tracker`.`Users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

INSERT INTO `fitness_tracker`.`Users` (`user_id`, `username`, `password`, `fname`, `lname`, `dob`, `height_ft`, `weight_lbs`, `gender`, `profile_pic`, `occupation`, `created_at`) VALUES
(1, 'john_doe', 'hashed_password', 'John', 'Doe', '1990-01-01', 5.8, 180, 'Male', 'path/to/profile_pic.jpg', 'Software Engineer', NOW());

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
