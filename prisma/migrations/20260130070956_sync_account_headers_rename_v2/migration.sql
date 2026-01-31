/*
  Warnings:

  - You are about to drop the column `accnt_no` on the `chart_of_account` table. All the data in the column will be lost.
  - You are about to drop the column `accnt_type_no` on the `chart_of_account` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `chart_of_account` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `chart_of_account` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `chart_of_account` table. All the data in the column will be lost.
  - You are about to drop the column `fsCategory` on the `chart_of_account` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `chart_of_account` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `chart_of_account` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `chart_of_account` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `chart_of_account` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[account_no]` on the table `chart_of_account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `account_name` to the `chart_of_account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `account_no` to the `chart_of_account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `account_type` to the `chart_of_account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_updated_at` to the `chart_of_account` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `chart_of_account_accnt_no_key` ON `chart_of_account`;

-- AlterTable
ALTER TABLE `chart_of_account` 
    RENAME COLUMN `accnt_no` TO `account_no`,
    RENAME COLUMN `accnt_type_no` TO `account_type_no`,
    RENAME COLUMN `name` TO `account_name`,
    RENAME COLUMN `description` TO `account_description`,
    RENAME COLUMN `type` TO `account_type`,
    RENAME COLUMN `category` TO `account_category`,
    RENAME COLUMN `status` TO `account_status`,
    RENAME COLUMN `fsCategory` TO `fs_category`,
    RENAME COLUMN `createdAt` TO `date_created`,
    RENAME COLUMN `updatedAt` TO `last_updated_at`;

-- CreateIndex
CREATE UNIQUE INDEX `chart_of_account_account_no_key` ON `chart_of_account`(`account_no`);
