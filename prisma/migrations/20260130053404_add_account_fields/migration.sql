-- AlterTable
ALTER TABLE `chart_of_account` ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `fsCategory` VARCHAR(191) NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'Active';
