/*
  Warnings:

  - You are about to drop the column `current` on the `experiences` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `education` ADD COLUMN `currentlyStudying` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `experiences` DROP COLUMN `current`,
    ADD COLUMN `currentlyWorking` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `worker_profiles` MODIFY `onboardingStep` ENUM('PERSONAL_INFO', 'SKILLS_HOURLY_RATE_INFO', 'EXPERIENCE_INFO', 'EDUCATION_INFO', 'LANGUAGE_INFO', 'AVAILABILITY_INFO', 'COMPLETED') NOT NULL DEFAULT 'PERSONAL_INFO';
