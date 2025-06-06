/*
  Warnings:

  - A unique constraint covering the columns `[businessProfileId]` on the table `profile_pictures` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `assets` ADD COLUMN `businessProfileId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `certificates` ADD COLUMN `certificateType` ENUM('SAFE_PASS', 'MANUAL_HANDLING', 'WORKING_AT_HEIGHT', 'PASMA', 'IPAF', 'ABRASIVE_WHEELS', 'CONFINED_SPACE_ENTRY', 'FIRST_AID_AT_WORK', 'FIRE_WARDEN', 'CSCS', 'QQI_ELECTRICIAN', 'QQI_PLUMBER', 'QQI_CARPENTER', 'QQI_BRICKLAYER', 'QQI_PLASTERER', 'OTHER') NULL;

-- AlterTable
ALTER TABLE `profile_pictures` ADD COLUMN `businessProfileId` VARCHAR(191) NULL,
    MODIFY `workerProfileId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `profile_pictures_businessProfileId_key` ON `profile_pictures`(`businessProfileId`);

-- AddForeignKey
ALTER TABLE `profile_pictures` ADD CONSTRAINT `profile_pictures_businessProfileId_fkey` FOREIGN KEY (`businessProfileId`) REFERENCES `business_profiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assets` ADD CONSTRAINT `assets_businessProfileId_fkey` FOREIGN KEY (`businessProfileId`) REFERENCES `business_profiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
