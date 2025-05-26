/*
  Warnings:

  - Added the required column `updatedAt` to the `business_profiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `business_profiles` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `Block` (
    `id` VARCHAR(191) NOT NULL,
    `blockType` ENUM('BUSINESS', 'WORKER', 'JOB') NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `businessId` VARCHAR(191) NULL,
    `workerId` VARCHAR(191) NULL,
    `jobId` VARCHAR(191) NULL,
    `reason` TEXT NOT NULL,
    `blockedBy` VARCHAR(191) NOT NULL,
    `blockedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `unBlockedAt` DATETIME(3) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Block_businessId_key`(`businessId`),
    UNIQUE INDEX `Block_workerId_key`(`workerId`),
    UNIQUE INDEX `Block_jobId_key`(`jobId`),
    UNIQUE INDEX `unique_business_block`(`businessId`, `blockType`),
    UNIQUE INDEX `unique_worker_block`(`workerId`, `blockType`),
    UNIQUE INDEX `unique_job_block`(`jobId`, `blockType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Block` ADD CONSTRAINT `Block_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Block` ADD CONSTRAINT `Block_businessId_fkey` FOREIGN KEY (`businessId`) REFERENCES `business_profiles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Block` ADD CONSTRAINT `Block_workerId_fkey` FOREIGN KEY (`workerId`) REFERENCES `worker_profiles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Block` ADD CONSTRAINT `Block_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `jobs`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
