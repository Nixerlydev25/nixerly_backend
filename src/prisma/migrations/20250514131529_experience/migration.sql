/*
  Warnings:

  - You are about to drop the column `location` on the `experiences` table. All the data in the column will be lost.
  - Added the required column `city` to the `experiences` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `experiences` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `experiences` DROP COLUMN `location`,
    ADD COLUMN `city` VARCHAR(191) NOT NULL,
    ADD COLUMN `country` VARCHAR(191) NOT NULL,
    ADD COLUMN `state` VARCHAR(191) NULL;
