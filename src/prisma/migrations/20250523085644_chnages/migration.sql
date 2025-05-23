/*
  Warnings:

  - You are about to drop the column `salary` on the `jobs` table. All the data in the column will be lost.
  - You are about to alter the column `jobType` on the `jobs` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(17))` to `Enum(EnumId(8))`.

*/
-- AlterTable
ALTER TABLE `jobs` DROP COLUMN `salary`,
    MODIFY `jobType` ENUM('FULL_TIME', 'PART_TIME', 'CONTRACT', 'TEMPORARY', 'INTERNSHIP') NOT NULL DEFAULT 'FULL_TIME';
