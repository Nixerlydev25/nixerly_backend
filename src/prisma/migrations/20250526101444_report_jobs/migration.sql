-- AlterTable
ALTER TABLE `reports` ADD COLUMN `reportedJobId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `reports` ADD CONSTRAINT `reports_reportedJobId_fkey` FOREIGN KEY (`reportedJobId`) REFERENCES `jobs`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
