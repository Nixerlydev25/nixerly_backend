/*
  Warnings:

  - The values [SKILLS_INFO,HOURLY_RATE_INFO] on the enum `worker_profiles_onboardingStep` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `worker_profiles` MODIFY `onboardingStep` ENUM('PERSONAL_INFO', 'SKILLS_HOURLY_RATE_INFO', 'PROFESSIONAL_INFO', 'AVAILABILITY_INFO', 'LANGUAGE_INFO', 'COMPLETED') NOT NULL DEFAULT 'PERSONAL_INFO';
