/*
  Warnings:

  - You are about to drop the column `jobId` on the `job_reports` table. All the data in the column will be lost.
  - The values [HARASSMENT,INAPPROPRIATE_CONTENT,FRAUD,FAKE_PROFILE,HATE_SPEECH,VIOLENCE,INTELLECTUAL_PROPERTY,IMPERSONATION] on the enum `job_reports_category` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `targetJobId` to the `job_reports` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `job_reports` DROP FOREIGN KEY `job_reports_jobId_fkey`;

-- AlterTable
ALTER TABLE `job_reports` DROP COLUMN `jobId`,
    ADD COLUMN `targetJobId` VARCHAR(191) NOT NULL,
    MODIFY `category` ENUM('SCAM_FRAUD', 'INAPPROPRIATE', 'MISLEADING', 'PRIVACY_VIOLATION', 'SPAM', 'DUPLICATE', 'EXPIRED', 'ILLEGAL', 'OTHER') NOT NULL DEFAULT 'OTHER';

-- AddForeignKey
ALTER TABLE `job_reports` ADD CONSTRAINT `job_reports_targetJobId_fkey` FOREIGN KEY (`targetJobId`) REFERENCES `jobs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
