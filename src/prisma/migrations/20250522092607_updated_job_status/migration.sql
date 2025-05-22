/*
  Warnings:

  - The values [IN_PROGRESS,COMPLETED,CANCELLED,EXPIRED] on the enum `jobs_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `jobs` MODIFY `status` ENUM('OPEN', 'CLOSED') NOT NULL DEFAULT 'OPEN';
