/*
  Warnings:

  - You are about to drop the column `userId` on the `CashFlow` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Restock` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Sale` table. All the data in the column will be lost.
  - Added the required column `createdById` to the `CashFlow` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `CashFlow` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Restock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Restock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Sale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Sale` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `CashFlow` DROP FOREIGN KEY `CashFlow_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Customer` DROP FOREIGN KEY `Customer_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Product` DROP FOREIGN KEY `Product_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Restock` DROP FOREIGN KEY `Restock_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Sale` DROP FOREIGN KEY `Sale_userId_fkey`;

-- DropIndex
DROP INDEX `CashFlow_userId_idx` ON `CashFlow`;

-- DropIndex
DROP INDEX `Customer_userId_idx` ON `Customer`;

-- DropIndex
DROP INDEX `Product_userId_idx` ON `Product`;

-- DropIndex
DROP INDEX `Restock_userId_idx` ON `Restock`;

-- DropIndex
DROP INDEX `Sale_userId_idx` ON `Sale`;

-- AlterTable
ALTER TABLE `CashFlow` DROP COLUMN `userId`,
    ADD COLUMN `createdById` INTEGER NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `updatedById` INTEGER NULL;

-- AlterTable
ALTER TABLE `Customer` DROP COLUMN `userId`,
    ADD COLUMN `createdById` INTEGER NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `updatedById` INTEGER NULL;

-- AlterTable
ALTER TABLE `Product` DROP COLUMN `userId`,
    ADD COLUMN `createdById` INTEGER NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `updatedById` INTEGER NULL;

-- AlterTable
ALTER TABLE `Restock` DROP COLUMN `userId`,
    ADD COLUMN `createdById` INTEGER NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `updatedById` INTEGER NULL;

-- AlterTable
ALTER TABLE `Sale` DROP COLUMN `userId`,
    ADD COLUMN `createdById` INTEGER NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `updatedById` INTEGER NULL;

-- CreateIndex
CREATE INDEX `CashFlow_createdById_idx` ON `CashFlow`(`createdById`);

-- CreateIndex
CREATE INDEX `CashFlow_updatedById_idx` ON `CashFlow`(`updatedById`);

-- CreateIndex
CREATE INDEX `Customer_createdById_idx` ON `Customer`(`createdById`);

-- CreateIndex
CREATE INDEX `Customer_updatedById_idx` ON `Customer`(`updatedById`);

-- CreateIndex
CREATE INDEX `Product_createdById_idx` ON `Product`(`createdById`);

-- CreateIndex
CREATE INDEX `Product_updatedById_idx` ON `Product`(`updatedById`);

-- CreateIndex
CREATE INDEX `Restock_createdById_idx` ON `Restock`(`createdById`);

-- CreateIndex
CREATE INDEX `Restock_updatedById_idx` ON `Restock`(`updatedById`);

-- CreateIndex
CREATE INDEX `Sale_createdById_idx` ON `Sale`(`createdById`);

-- CreateIndex
CREATE INDEX `Sale_updatedById_idx` ON `Sale`(`updatedById`);

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Restock` ADD CONSTRAINT `Restock_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Restock` ADD CONSTRAINT `Restock_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Customer` ADD CONSTRAINT `Customer_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Customer` ADD CONSTRAINT `Customer_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sale` ADD CONSTRAINT `Sale_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sale` ADD CONSTRAINT `Sale_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CashFlow` ADD CONSTRAINT `CashFlow_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CashFlow` ADD CONSTRAINT `CashFlow_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
