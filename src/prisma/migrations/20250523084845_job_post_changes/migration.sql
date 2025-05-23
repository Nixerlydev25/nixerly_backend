/*
  Warnings:

  - You are about to alter the column `jobType` on the `jobs` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(13))` to `Enum(EnumId(8))`.

*/
-- First add temporary column and salary column
ALTER TABLE `jobs` 
    ADD COLUMN `salary` DOUBLE NULL,
    ADD COLUMN `jobType_new` ENUM('HOURLY', 'CONTRACT', 'SALARY') NOT NULL DEFAULT 'HOURLY';

-- Update temporary column with mapped values from original column
-- Convert existing values to match new enum values
UPDATE `jobs` SET `jobType_new` = 
    CASE 
        WHEN `jobType` IN ('HOURLY', 'CONTRACT', 'SALARY') THEN `jobType`
        ELSE 'HOURLY' -- Default to 'HOURLY' for any values that don't match
    END;

-- Drop the original column and rename the temporary column
ALTER TABLE `jobs` 
    DROP COLUMN `jobType`,
    CHANGE COLUMN `jobType_new` `jobType` ENUM('HOURLY', 'CONTRACT', 'SALARY') NOT NULL DEFAULT 'HOURLY';
