/*
  Warnings:

  - You are about to drop the column `user_id` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `full_name` to the `accounts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `accounts` DROP FOREIGN KEY `accounts_user_id_fkey`;

-- DropIndex
DROP INDEX `accounts_user_id_fkey` ON `accounts`;

-- AlterTable
ALTER TABLE `accounts` DROP COLUMN `user_id`,
    ADD COLUMN `full_name` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `users`;
