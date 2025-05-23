/*
  Warnings:

  - You are about to drop the column `duration` on the `job_applications` table. All the data in the column will be lost.
  - Added the required column `availability` to the `job_applications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `job_applications` DROP COLUMN `duration`,
    ADD COLUMN `availability` VARCHAR(191) NOT NULL;
