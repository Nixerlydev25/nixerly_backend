/*
  Warnings:

  - You are about to alter the column `jobType` on the `jobs` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(17))` to `Enum(EnumId(8))`.

*/
-- AlterTable
ALTER TABLE `jobs` ADD COLUMN `salary` DOUBLE NULL,
    MODIFY `jobType` ENUM('HOURLY', 'CONTRACT', 'SALARY') NOT NULL DEFAULT 'HOURLY';
