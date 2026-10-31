CREATE TABLE `SaleOrder` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `total` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdById` INTEGER NOT NULL,
    `updatedById` INTEGER NULL,
    `customerId` INTEGER NOT NULL,
    INDEX `SaleOrder_createdById_idx`(`createdById`),
    INDEX `SaleOrder_updatedById_idx`(`updatedById`),
    INDEX `SaleOrder_customerId_idx`(`customerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `Sale` ADD COLUMN `saleOrderId` INTEGER NULL;

INSERT INTO `SaleOrder` (`id`, `total`, `createdAt`, `updatedAt`, `createdById`, `updatedById`, `customerId`)
SELECT `id`, `total`, `createdAt`, `updatedAt`, `createdById`, `updatedById`, `customerId`
FROM `Sale`;

UPDATE `Sale` SET `saleOrderId` = `id`;

ALTER TABLE `CashFlow` ADD COLUMN `saleOrderId` INTEGER NULL;

UPDATE `CashFlow`
INNER JOIN `Sale` ON `CashFlow`.`saleId` = `Sale`.`id`
SET `CashFlow`.`saleOrderId` = `Sale`.`saleOrderId`
WHERE `CashFlow`.`saleId` IS NOT NULL;

ALTER TABLE `Sale` MODIFY `saleOrderId` INTEGER NOT NULL;

CREATE UNIQUE INDEX `CashFlow_saleOrderId_key` ON `CashFlow`(`saleOrderId`);
CREATE INDEX `Sale_saleOrderId_idx` ON `Sale`(`saleOrderId`);

ALTER TABLE `Sale`
    ADD CONSTRAINT `Sale_saleOrderId_fkey`
    FOREIGN KEY (`saleOrderId`) REFERENCES `SaleOrder`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `SaleOrder`
    ADD CONSTRAINT `SaleOrder_createdById_fkey`
    FOREIGN KEY (`createdById`) REFERENCES `User`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT `SaleOrder_updatedById_fkey`
    FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`)
    ON DELETE SET NULL ON UPDATE CASCADE,
    ADD CONSTRAINT `SaleOrder_customerId_fkey`
    FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `CashFlow`
    ADD CONSTRAINT `CashFlow_saleOrderId_fkey`
    FOREIGN KEY (`saleOrderId`) REFERENCES `SaleOrder`(`id`)
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `CashFlow` DROP FOREIGN KEY `CashFlow_saleId_fkey`;
DROP INDEX `CashFlow_saleId_key` ON `CashFlow`;
ALTER TABLE `CashFlow` DROP COLUMN `saleId`;
