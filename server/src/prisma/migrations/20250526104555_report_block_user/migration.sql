/*
  Warnings:

  - You are about to drop the column `status` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the `block` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `block` DROP FOREIGN KEY `Block_businessId_fkey`;

-- DropForeignKey
ALTER TABLE `block` DROP FOREIGN KEY `Block_jobId_fkey`;

-- DropForeignKey
ALTER TABLE `block` DROP FOREIGN KEY `Block_reportId_fkey`;

-- DropForeignKey
ALTER TABLE `block` DROP FOREIGN KEY `Block_userId_fkey`;

-- DropForeignKey
ALTER TABLE `block` DROP FOREIGN KEY `Block_workerId_fkey`;

-- AlterTable
ALTER TABLE `business_profiles` ADD COLUMN `isBlocked` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `jobs` ADD COLUMN `isBlocked` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `reports` DROP COLUMN `status`;

-- AlterTable
ALTER TABLE `worker_profiles` ADD COLUMN `isBlocked` BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE `block`;
