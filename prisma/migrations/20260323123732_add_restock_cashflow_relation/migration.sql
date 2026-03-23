/*
  Warnings:

  - A unique constraint covering the columns `[restockId]` on the table `CashFlow` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `CashFlow` ADD COLUMN `restockId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `CashFlow_restockId_key` ON `CashFlow`(`restockId`);

-- AddForeignKey
ALTER TABLE `CashFlow` ADD CONSTRAINT `CashFlow_restockId_fkey` FOREIGN KEY (`restockId`) REFERENCES `Restock`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
