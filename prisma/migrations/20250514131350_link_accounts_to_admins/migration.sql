/*
  Warnings:

  - Added the required column `created_by_admin_id` to the `accounts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `accounts` ADD COLUMN `created_by_admin_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_created_by_admin_id_fkey` FOREIGN KEY (`created_by_admin_id`) REFERENCES `Admin`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
