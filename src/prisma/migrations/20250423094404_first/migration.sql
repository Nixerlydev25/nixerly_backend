-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isVerified` BOOLEAN NOT NULL DEFAULT false,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `isSuspended` BOOLEAN NOT NULL DEFAULT false,
    `role` ENUM('WORKER', 'BUSINESS', 'ADMIN') NOT NULL DEFAULT 'WORKER',
    `provider` ENUM('GOOGLE', 'OUTLOOK', 'FACEBOOK', 'GITHUB', 'EMAIL_PASSWORD') NOT NULL DEFAULT 'EMAIL_PASSWORD',
    `defaultProfile` ENUM('WORKER', 'BUSINESS') NOT NULL DEFAULT 'WORKER',

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_restrictions` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `restrictionType` ENUM('APPLY_TO_JOBS', 'SEND_MESSAGES', 'POST_JOBS', 'HIRE_WORKERS', 'VIEW_PROFILES', 'SUBMIT_REVIEWS', 'SUBMIT_REPORTS') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiresAt` DATETIME(3) NULL,
    `reason` TEXT NULL,

    UNIQUE INDEX `user_restrictions_userId_restrictionType_key`(`userId`, `restrictionType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `worker_profiles` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NULL,
    `hourlyRate` DOUBLE NULL,
    `description` TEXT NULL,
    `categoryId` VARCHAR(191) NULL,
    `location` VARCHAR(191) NULL,
    `availability` BOOLEAN NOT NULL DEFAULT true,
    `totalEarnings` DOUBLE NOT NULL DEFAULT 0,
    `completedJobs` INTEGER NOT NULL DEFAULT 0,
    `avgRating` DOUBLE NOT NULL DEFAULT 0,

    UNIQUE INDEX `worker_profiles_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `business_profiles` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `companyName` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `industry` VARCHAR(191) NULL,
    `location` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `employeeCount` INTEGER NULL,
    `yearFounded` INTEGER NULL,
    `totalSpent` DOUBLE NOT NULL DEFAULT 0,
    `postedJobs` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `business_profiles_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `conversations` (
    `id` VARCHAR(191) NOT NULL,
    `workerProfileId` VARCHAR(191) NOT NULL,
    `businessProfileId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `conversations_workerProfileId_businessProfileId_key`(`workerProfileId`, `businessProfileId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `messages` (
    `id` VARCHAR(191) NOT NULL,
    `conversationId` VARCHAR(191) NOT NULL,
    `senderId` VARCHAR(191) NOT NULL,
    `receiverId` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jobs` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `budget` DOUBLE NULL,
    `hourlyRateMin` DOUBLE NULL,
    `hourlyRateMax` DOUBLE NULL,
    `categoryId` VARCHAR(191) NOT NULL,
    `posterId` VARCHAR(191) NOT NULL,
    `status` ENUM('OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'EXPIRED') NOT NULL DEFAULT 'OPEN',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `expiresAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `job_applications` (
    `id` VARCHAR(191) NOT NULL,
    `jobId` VARCHAR(191) NOT NULL,
    `workerId` VARCHAR(191) NOT NULL,
    `coverLetter` TEXT NOT NULL,
    `proposedRate` DOUBLE NOT NULL,
    `status` ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contracts` (
    `id` VARCHAR(191) NOT NULL,
    `jobId` VARCHAR(191) NOT NULL,
    `workerId` VARCHAR(191) NOT NULL,
    `businessId` VARCHAR(191) NOT NULL,
    `status` ENUM('ACTIVE', 'COMPLETED', 'CANCELLED', 'DISPUTED') NOT NULL DEFAULT 'ACTIVE',
    `startDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `endDate` DATETIME(3) NULL,
    `paymentRate` DOUBLE NOT NULL,
    `totalAmount` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `milestones` (
    `id` VARCHAR(191) NOT NULL,
    `contractId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `amount` DOUBLE NOT NULL,
    `dueDate` DATETIME(3) NOT NULL,
    `status` ENUM('PENDING', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reviews` (
    `id` VARCHAR(191) NOT NULL,
    `rating` DOUBLE NOT NULL,
    `comment` TEXT NOT NULL,
    `workerProfileId` VARCHAR(191) NULL,
    `businessProfileId` VARCHAR(191) NULL,
    `contractId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reports` (
    `id` VARCHAR(191) NOT NULL,
    `reporterId` VARCHAR(191) NOT NULL,
    `reportedId` VARCHAR(191) NOT NULL,
    `reason` TEXT NOT NULL,
    `status` ENUM('PENDING', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `projects` (
    `id` VARCHAR(191) NOT NULL,
    `workerId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `completionDate` DATETIME(3) NOT NULL,
    `projectUrl` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assets` (
    `id` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `type` ENUM('IMAGE', 'VIDEO', 'DOCUMENT') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `experiences` (
    `id` VARCHAR(191) NOT NULL,
    `workerId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `company` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NULL,
    `description` TEXT NOT NULL,
    `current` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `education` (
    `id` VARCHAR(191) NOT NULL,
    `workerId` VARCHAR(191) NOT NULL,
    `school` VARCHAR(191) NOT NULL,
    `degree` VARCHAR(191) NOT NULL,
    `fieldOfStudy` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NULL,
    `description` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `certificates` (
    `id` VARCHAR(191) NOT NULL,
    `workerId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `issuingOrg` VARCHAR(191) NOT NULL,
    `issueDate` DATETIME(3) NOT NULL,
    `expiryDate` DATETIME(3) NULL,
    `credentialUrl` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `id` VARCHAR(191) NOT NULL,
    `name` ENUM('PLUMBING', 'ELECTRICAL', 'CARPENTRY', 'HVAC', 'PAINTING', 'LANDSCAPING', 'CLEANING', 'MOVING', 'AUTOMOTIVE', 'ROOFING', 'MASONRY', 'WELDING', 'FLOORING', 'PEST_CONTROL', 'APPLIANCE_REPAIR', 'GENERAL_MAINTENANCE', 'MANAGEMENT', 'INSPECTION', 'TECHNICIAN', 'FABRICATION', 'MAINTENANCE', 'GROUNDWORKS', 'RIGGING') NOT NULL,
    `description` TEXT NULL,

    UNIQUE INDEX `categories_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sub_categories` (
    `id` VARCHAR(191) NOT NULL,
    `name` ENUM('PIPE_INSTALLATION', 'DRAIN_CLEANING', 'FIXTURE_INSTALLATION', 'WATER_HEATER_SERVICE', 'LEAK_REPAIR', 'WIRING_INSTALLATION', 'LIGHTING_INSTALLATION', 'ELECTRICAL_REPAIR', 'PANEL_UPGRADES', 'GENERATOR_INSTALLATION', 'CABINET_MAKING', 'FRAMING', 'FINISH_CARPENTRY', 'DOOR_INSTALLATION', 'WINDOW_INSTALLATION', 'AC_INSTALLATION', 'HEATING_REPAIR', 'VENTILATION_WORK', 'DUCT_CLEANING', 'SYSTEM_MAINTENANCE', 'SUPERVISOR', 'CONSTRUCTION_MANAGER', 'QAQC_ENGINEER', 'HSA_ADVISOR', 'SITE_INSPECTOR', 'PROJECT_COORDINATOR', 'INSTRUMENT_TECHNICIAN', 'MAINTENANCE_TECHNICIAN', 'MECHANIC', 'PIPEFITTING', 'METAL_FABRICATION', 'WELDING_ASSEMBLY', 'STRUCTURAL_FABRICATION', 'EQUIPMENT_REPAIR', 'FACILITY_UPKEEP', 'MECHANICAL_OVERHAUL', 'PLANT_MAINTENANCE', 'EXCAVATION', 'TRENCHING', 'SITE_CLEARANCE', 'LAND_GRADING', 'DEWATERING', 'SOIL_STABILISATION', 'COMPACTION', 'CRANE_OPERATION', 'SLINGING', 'WINCHING', 'HOISTING', 'SCAFFOLD_RIGGING') NOT NULL,
    `categoryId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `sub_categories_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `skills` (
    `id` VARCHAR(191) NOT NULL,
    `name` ENUM('PIPE_FITTING', 'DRAIN_SNAKING', 'SOLDERING', 'WATER_PRESSURE_MANAGEMENT', 'BACKFLOW_PREVENTION', 'CIRCUIT_TESTING', 'CONDUIT_BENDING', 'VOLTAGE_TESTING', 'TRANSFORMER_INSTALLATION', 'ELECTRICAL_TROUBLESHOOTING', 'WOODWORKING', 'BLUEPRINT_READING', 'POWER_TOOL_OPERATION', 'MEASURING_CUTTING', 'FURNITURE_ASSEMBLY', 'REFRIGERANT_HANDLING', 'THERMOSTAT_PROGRAMMING', 'DUCTWORK_FABRICATION', 'HEAT_PUMP_REPAIR', 'FURNACE_MAINTENANCE', 'TEAM_COORDINATION', 'BUDGET_MANAGEMENT', 'SCHEDULE_PLANNING', 'RISK_ASSESSMENT', 'SAFETY_COMPLIANCE', 'QUALITY_AUDITING', 'STAKEHOLDER_COMMUNICATION', 'CALIBRATION', 'TROUBLESHOOTING', 'PREVENTIVE_MAINTENANCE', 'EQUIPMENT_DIAGNOSTICS', 'ROOT_CAUSE_ANALYSIS', 'FITTING_ALIGNMENT', 'METAL_CUTTING', 'WELD_PARAMETER_SETTING', 'BLUEPRINT_INTERPRETATION', 'LUBRICATION', 'BEARING_REPLACEMENT', 'HYDRAULIC_DIAGNOSTICS', 'ELECTROMECHANICAL_REPAIRS', 'EXCAVATOR_OPERATION', 'BULLDOZER_OPERATION', 'GRADER_OPERATION', 'COMPACTION_TESTING', 'SOIL_SAMPLING', 'LASER_LEVEL_SURVEY', 'SITE_CLEARANCE', 'DEWATERING_SETUP', 'LIFT_PLANNING', 'SIGNAL_MANAGEMENT', 'SLING_SELECTION', 'LOAD_CALCULATION', 'RIGGING_INSPECTION', 'CRANE_MAINTENANCE') NOT NULL,

    UNIQUE INDEX `skills_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `languages` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `proficiency` ENUM('BASIC', 'CONVERSATIONAL', 'FLUENT', 'NATIVE') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `otps` (
    `id` VARCHAR(191) NOT NULL,
    `otp` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `isExpired` BOOLEAN NOT NULL DEFAULT false,
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_JobToSkill` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_JobToSkill_AB_unique`(`A`, `B`),
    INDEX `_JobToSkill_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_SkillToWorkerProfile` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_SkillToWorkerProfile_AB_unique`(`A`, `B`),
    INDEX `_SkillToWorkerProfile_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_LanguageToWorkerProfile` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_LanguageToWorkerProfile_AB_unique`(`A`, `B`),
    INDEX `_LanguageToWorkerProfile_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_restrictions` ADD CONSTRAINT `user_restrictions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `worker_profiles` ADD CONSTRAINT `worker_profiles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `worker_profiles` ADD CONSTRAINT `worker_profiles_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `business_profiles` ADD CONSTRAINT `business_profiles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conversations` ADD CONSTRAINT `conversations_workerProfileId_fkey` FOREIGN KEY (`workerProfileId`) REFERENCES `worker_profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conversations` ADD CONSTRAINT `conversations_businessProfileId_fkey` FOREIGN KEY (`businessProfileId`) REFERENCES `business_profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `conversations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jobs` ADD CONSTRAINT `jobs_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jobs` ADD CONSTRAINT `jobs_posterId_fkey` FOREIGN KEY (`posterId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `job_applications` ADD CONSTRAINT `job_applications_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `jobs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `job_applications` ADD CONSTRAINT `job_applications_workerId_fkey` FOREIGN KEY (`workerId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contracts` ADD CONSTRAINT `contracts_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `jobs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contracts` ADD CONSTRAINT `contracts_workerId_fkey` FOREIGN KEY (`workerId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contracts` ADD CONSTRAINT `contracts_businessId_fkey` FOREIGN KEY (`businessId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `milestones` ADD CONSTRAINT `milestones_contractId_fkey` FOREIGN KEY (`contractId`) REFERENCES `contracts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_workerProfileId_fkey` FOREIGN KEY (`workerProfileId`) REFERENCES `worker_profiles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_businessProfileId_fkey` FOREIGN KEY (`businessProfileId`) REFERENCES `business_profiles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reports` ADD CONSTRAINT `reports_reporterId_fkey` FOREIGN KEY (`reporterId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reports` ADD CONSTRAINT `reports_reportedId_fkey` FOREIGN KEY (`reportedId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_workerId_fkey` FOREIGN KEY (`workerId`) REFERENCES `worker_profiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assets` ADD CONSTRAINT `assets_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `experiences` ADD CONSTRAINT `experiences_workerId_fkey` FOREIGN KEY (`workerId`) REFERENCES `worker_profiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `education` ADD CONSTRAINT `education_workerId_fkey` FOREIGN KEY (`workerId`) REFERENCES `worker_profiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `certificates` ADD CONSTRAINT `certificates_workerId_fkey` FOREIGN KEY (`workerId`) REFERENCES `worker_profiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sub_categories` ADD CONSTRAINT `sub_categories_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `otps` ADD CONSTRAINT `otps_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_JobToSkill` ADD CONSTRAINT `_JobToSkill_A_fkey` FOREIGN KEY (`A`) REFERENCES `jobs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_JobToSkill` ADD CONSTRAINT `_JobToSkill_B_fkey` FOREIGN KEY (`B`) REFERENCES `skills`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SkillToWorkerProfile` ADD CONSTRAINT `_SkillToWorkerProfile_A_fkey` FOREIGN KEY (`A`) REFERENCES `skills`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SkillToWorkerProfile` ADD CONSTRAINT `_SkillToWorkerProfile_B_fkey` FOREIGN KEY (`B`) REFERENCES `worker_profiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_LanguageToWorkerProfile` ADD CONSTRAINT `_LanguageToWorkerProfile_A_fkey` FOREIGN KEY (`A`) REFERENCES `languages`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_LanguageToWorkerProfile` ADD CONSTRAINT `_LanguageToWorkerProfile_B_fkey` FOREIGN KEY (`B`) REFERENCES `worker_profiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
