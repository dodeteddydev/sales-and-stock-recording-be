/*
  Warnings:

  - A unique constraint covering the columns `[saleId]` on the table `CashFlow` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `CashFlow` ADD COLUMN `saleId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `CashFlow_saleId_key` ON `CashFlow`(`saleId`);

-- AddForeignKey
ALTER TABLE `CashFlow` ADD CONSTRAINT `CashFlow_saleId_fkey` FOREIGN KEY (`saleId`) REFERENCES `Sale`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
