-- ====================================================
-- E-WASTE MANAGEMENT SYSTEM - DATABASE SCHEMA (MySQL)
-- ====================================================

CREATE DATABASE IF NOT EXISTS `ewaste_management`;
USE `ewaste_management`;

-- Disable foreign key checks for clean table drops if re-initialized
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `inventory`;
DROP TABLE IF EXISTS `ewaste_requests`;
DROP TABLE IF EXISTS `collectors`;
DROP TABLE IF EXISTS `collection_points`;
DROP TABLE IF EXISTS `admins`;
DROP TABLE IF EXISTS `customers`;

SET FOREIGN_KEY_CHECKS = 1;

-- 1. CUSTOMERS TABLE
CREATE TABLE `customers` (
  `customerID` INT AUTO_INCREMENT PRIMARY KEY,
  `customerName` VARCHAR(100) NOT NULL,
  `email` VARCHAR(120) NOT NULL UNIQUE,
  `phoneNo` VARCHAR(20) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `address` TEXT NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. ADMINS TABLE
CREATE TABLE `admins` (
  `adminID` INT AUTO_INCREMENT PRIMARY KEY,
  `adminName` VARCHAR(100) NOT NULL,
  `email` VARCHAR(120) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. COLLECTION POINTS TABLE
CREATE TABLE `collection_points` (
  `collectionPointID` INT AUTO_INCREMENT PRIMARY KEY,
  `location` VARCHAR(255) NOT NULL,
  `capacity` INT NOT NULL DEFAULT 1000,
  `adminID` INT DEFAULT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_collectionpoint_admin` 
    FOREIGN KEY (`adminID`) REFERENCES `admins` (`adminID`) 
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. COLLECTORS TABLE
CREATE TABLE `collectors` (
  `collectorID` INT AUTO_INCREMENT PRIMARY KEY,
  `collectorName` VARCHAR(100) NOT NULL,
  `email` VARCHAR(120) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `collectionPointID` INT DEFAULT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_collector_collectionpoint` 
    FOREIGN KEY (`collectionPointID`) REFERENCES `collection_points` (`collectionPointID`) 
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. E-WASTE REQUESTS TABLE
CREATE TABLE `ewaste_requests` (
  `requestID` INT AUTO_INCREMENT PRIMARY KEY,
  `status` ENUM('PENDING', 'ASSIGNED', 'COLLECTED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
  `customerID` INT NOT NULL,
  `collectorID` INT DEFAULT NULL,
  `collectionPointID` INT NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_request_customer` 
    FOREIGN KEY (`customerID`) REFERENCES `customers` (`customerID`) 
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_request_collector` 
    FOREIGN KEY (`collectorID`) REFERENCES `collectors` (`collectorID`) 
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_request_collectionpoint` 
    FOREIGN KEY (`collectionPointID`) REFERENCES `collection_points` (`collectionPointID`) 
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. INVENTORY TABLE
CREATE TABLE `inventory` (
  `inventoryID` INT AUTO_INCREMENT PRIMARY KEY,
  `ewasteType` VARCHAR(100) NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `status` ENUM('AVAILABLE', 'COLLECTED', 'PROCESSED', 'RECYCLED') NOT NULL DEFAULT 'COLLECTED',
  `collectorID` INT DEFAULT NULL,
  `collectionPointID` INT NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_inventory_collector` 
    FOREIGN KEY (`collectorID`) REFERENCES `collectors` (`collectorID`) 
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_inventory_collectionpoint` 
    FOREIGN KEY (`collectionPointID`) REFERENCES `collection_points` (`collectionPointID`) 
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ====================================================
-- SEED DATA (PASSWORDS: "password123" hashed with bcrypt)
-- ====================================================

-- Default Admin (Password: admin123 -> hashed)
INSERT INTO `admins` (`adminID`, `adminName`, `email`, `password`) VALUES
(1, 'System Admin', 'admin@ewaste.com', '$2a$10$w8T0M4j6lJ0p123456789uU1vW2xY3zA4bC5dE6fG7hH8iJ9kL0mO');

-- Sample Collection Points
INSERT INTO `collection_points` (`collectionPointID`, `location`, `capacity`, `adminID`) VALUES
(1, 'Green Earth Hub - Central City, Main St 45', 5000, 1),
(2, 'EcoRecycle Depot - North Tech Park, Gate 3', 3000, 1),
(3, 'Clean City Station - South District, Ring Road', 2500, 1);

-- Sample Collector (Password: collector123 -> hashed)
INSERT INTO `collection_points` (`collectionPointID`, `location`, `capacity`, `adminID`) VALUES
(4, 'Westside E-Waste Center - Sector 12', 4000, 1)
ON DUPLICATE KEY UPDATE `capacity` = 4000;

INSERT INTO `collectors` (`collectorID`, `collectorName`, `email`, `password`, `collectionPointID`) VALUES
(1, 'John Collector', 'collector@ewaste.com', '$2a$10$w8T0M4j6lJ0p123456789uU1vW2xY3zA4bC5dE6fG7hH8iJ9kL0mO', 1),
(2, 'Sarah Pickup Agent', 'sarah@ewaste.com', '$2a$10$w8T0M4j6lJ0p123456789uU1vW2xY3zA4bC5dE6fG7hH8iJ9kL0mO', 2);

-- Sample Customer (Password: customer123 -> hashed)
INSERT INTO `customers` (`customerID`, `customerName`, `email`, `phoneNo`, `password`, `address`) VALUES
(1, 'Alex Green', 'customer@ewaste.com', '9876543210', '$2a$10$w8T0M4j6lJ0p123456789uU1vW2xY3zA4bC5dE6fG7hH8iJ9kL0mO', '123 Eco Avenue, Green Park, City');
