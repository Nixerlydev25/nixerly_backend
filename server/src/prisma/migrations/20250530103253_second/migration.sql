/*
  Warnings:

  - You are about to drop the `reports` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `reports` DROP FOREIGN KEY `reports_reportedBusinessId_fkey`;

-- DropForeignKey
ALTER TABLE `reports` DROP FOREIGN KEY `reports_reportedJobId_fkey`;

-- DropForeignKey
ALTER TABLE `reports` DROP FOREIGN KEY `reports_reportedWorkerId_fkey`;

-- DropForeignKey
ALTER TABLE `reports` DROP FOREIGN KEY `reports_reporterBusinessId_fkey`;

-- DropForeignKey
ALTER TABLE `reports` DROP FOREIGN KEY `reports_reporterWorkerId_fkey`;

-- AlterTable
ALTER TABLE `user_restrictions` MODIFY `restrictionType` ENUM('APPLY_TO_JOBS', 'SEND_MESSAGES', 'POST_JOBS', 'HIRE_WORKERS', 'VIEW_PROFILES', 'SUBMIT_REVIEWS', 'SUBMIT_REPORTS', 'BLOCKED') NOT NULL;

-- DropTable
DROP TABLE `reports`;

-- CreateTable
CREATE TABLE `job_reports` (
    `id` VARCHAR(191) NOT NULL,
    `jobId` VARCHAR(191) NOT NULL,
    `reporterWorkerId` VARCHAR(191) NULL,
    `reporterBusinessId` VARCHAR(191) NULL,
    `reason` TEXT NOT NULL,
    `category` ENUM('HARASSMENT', 'SPAM', 'INAPPROPRIATE_CONTENT', 'FRAUD', 'FAKE_PROFILE', 'HATE_SPEECH', 'VIOLENCE', 'INTELLECTUAL_PROPERTY', 'IMPERSONATION', 'OTHER') NOT NULL DEFAULT 'OTHER',
    `status` ENUM('PENDING', 'RESOLVED', 'REJECTED', 'UNDER_REVIEW') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `worker_reports` (
    `id` VARCHAR(191) NOT NULL,
    `targetWorkerId` VARCHAR(191) NOT NULL,
    `reporterWorkerId` VARCHAR(191) NULL,
    `reporterBusinessId` VARCHAR(191) NULL,
    `reason` TEXT NOT NULL,
    `category` ENUM('HARASSMENT', 'SPAM', 'INAPPROPRIATE_CONTENT', 'FRAUD', 'FAKE_PROFILE', 'HATE_SPEECH', 'VIOLENCE', 'INTELLECTUAL_PROPERTY', 'IMPERSONATION', 'OTHER') NOT NULL DEFAULT 'OTHER',
    `status` ENUM('PENDING', 'RESOLVED', 'REJECTED', 'UNDER_REVIEW') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `business_reports` (
    `id` VARCHAR(191) NOT NULL,
    `targetBusinessId` VARCHAR(191) NOT NULL,
    `reporterWorkerId` VARCHAR(191) NULL,
    `reporterBusinessId` VARCHAR(191) NULL,
    `reason` TEXT NOT NULL,
    `category` ENUM('HARASSMENT', 'SPAM', 'INAPPROPRIATE_CONTENT', 'FRAUD', 'FAKE_PROFILE', 'HATE_SPEECH', 'VIOLENCE', 'INTELLECTUAL_PROPERTY', 'IMPERSONATION', 'OTHER') NOT NULL DEFAULT 'OTHER',
    `status` ENUM('PENDING', 'RESOLVED', 'REJECTED', 'UNDER_REVIEW') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `job_reports` ADD CONSTRAINT `job_reports_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `jobs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `job_reports` ADD CONSTRAINT `job_reports_reporterWorkerId_fkey` FOREIGN KEY (`reporterWorkerId`) REFERENCES `worker_profiles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `job_reports` ADD CONSTRAINT `job_reports_reporterBusinessId_fkey` FOREIGN KEY (`reporterBusinessId`) REFERENCES `business_profiles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `worker_reports` ADD CONSTRAINT `worker_reports_targetWorkerId_fkey` FOREIGN KEY (`targetWorkerId`) REFERENCES `worker_profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `worker_reports` ADD CONSTRAINT `worker_reports_reporterWorkerId_fkey` FOREIGN KEY (`reporterWorkerId`) REFERENCES `worker_profiles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `worker_reports` ADD CONSTRAINT `worker_reports_reporterBusinessId_fkey` FOREIGN KEY (`reporterBusinessId`) REFERENCES `business_profiles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `business_reports` ADD CONSTRAINT `business_reports_targetBusinessId_fkey` FOREIGN KEY (`targetBusinessId`) REFERENCES `business_profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `business_reports` ADD CONSTRAINT `business_reports_reporterWorkerId_fkey` FOREIGN KEY (`reporterWorkerId`) REFERENCES `worker_profiles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `business_reports` ADD CONSTRAINT `business_reports_reporterBusinessId_fkey` FOREIGN KEY (`reporterBusinessId`) REFERENCES `business_profiles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
