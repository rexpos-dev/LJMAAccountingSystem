/*
  Warnings:

  - You are about to drop the column `designation` on the `user_permission` table. All the data in the column will be lost.
  - You are about to drop the column `middleName` on the `user_permission` table. All the data in the column will be lost.
  - You are about to drop the column `userAccess` on the `user_permission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `reminder` ADD COLUMN `isRead` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `supplier` ADD COLUMN `additionalInfo` VARCHAR(191) NULL,
    ADD COLUMN `contactFirstName` VARCHAR(191) NULL,
    ADD COLUMN `fax` VARCHAR(191) NULL,
    ADD COLUMN `isTaxExempt` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `paymentTermsValue` VARCHAR(191) NULL,
    ADD COLUMN `phoneAlternative` VARCHAR(191) NULL,
    ADD COLUMN `vatInfo` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user_permission` DROP COLUMN `designation`,
    DROP COLUMN `middleName`,
    DROP COLUMN `userAccess`,
    ADD COLUMN `password` VARCHAR(191) NULL,
    MODIFY `permissions` TEXT NOT NULL;

-- CreateTable
CREATE TABLE `business_profile` (
    `id` VARCHAR(191) NOT NULL,
    `businessName` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NULL,
    `owner` VARCHAR(191) NULL,
    `contactPhone` VARCHAR(191) NULL,
    `contactTel` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `tin` VARCHAR(191) NULL,
    `permit` VARCHAR(191) NULL,
    `logo` LONGTEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `backup_schedule` (
    `id` VARCHAR(191) NOT NULL,
    `backupTime` DATETIME(3) NOT NULL,
    `frequency` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notification` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NULL,
    `entityId` VARCHAR(191) NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `backup_job` (
    `id` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `filePath` VARCHAR(191) NULL,
    `fileName` VARCHAR(191) NULL,
    `fileSize` VARCHAR(191) NULL,
    `createdBy` VARCHAR(191) NULL,
    `log` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `completedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `purchase_order` (
    `id` VARCHAR(191) NOT NULL,
    `supplierId` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `vendorAddress` TEXT NULL,
    `shippingAddress` TEXT NULL,
    `taxType` VARCHAR(191) NULL DEFAULT 'default',
    `comments` TEXT NULL,
    `privateComments` TEXT NULL,
    `subtotal` DOUBLE NOT NULL DEFAULT 0,
    `taxTotal` DOUBLE NOT NULL DEFAULT 0,
    `total` DOUBLE NOT NULL DEFAULT 0,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Open',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `purchase_order_item` (
    `id` VARCHAR(191) NOT NULL,
    `purchaseOrderId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NULL,
    `itemDescription` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `unitPrice` DOUBLE NOT NULL,
    `tax` DOUBLE NULL,
    `total` DOUBLE NOT NULL,
    `category` VARCHAR(191) NULL,
    `sku` VARCHAR(191) NULL,
    `barcode` VARCHAR(191) NULL,
    `buyingUom` VARCHAR(191) NULL,
    `qtyPerCase` INTEGER NULL,
    `offtake` INTEGER NULL,
    `orderQty` INTEGER NULL,
    `pieces` INTEGER NULL,
    `costPricePerCase` DOUBLE NULL,
    `costPricePerPiece` DOUBLE NULL,
    `discount1` DOUBLE NULL,
    `discount2` DOUBLE NULL,
    `discount3` DOUBLE NULL,
    `netCostAmount` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `invoice` (
    `id` VARCHAR(191) NOT NULL,
    `invoiceNumber` VARCHAR(191) NOT NULL,
    `customerId` VARCHAR(191) NOT NULL,
    `customerPONumber` VARCHAR(191) NULL,
    `date` DATETIME(3) NOT NULL,
    `dueDate` DATETIME(3) NULL,
    `terms` VARCHAR(191) NULL,
    `salesperson` VARCHAR(191) NULL,
    `depositAccount` VARCHAR(191) NULL,
    `billingAddress` TEXT NULL,
    `shippingAddress` TEXT NULL,
    `subtotal` DOUBLE NOT NULL DEFAULT 0,
    `total` DOUBLE NOT NULL DEFAULT 0,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Pending',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `invoice_invoiceNumber_key`(`invoiceNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `invoice_item` (
    `id` VARCHAR(191) NOT NULL,
    `invoiceId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NULL,
    `description` VARCHAR(191) NOT NULL,
    `quantity` DOUBLE NOT NULL,
    `unitPrice` DOUBLE NOT NULL,
    `total` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_history` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `field` VARCHAR(191) NOT NULL,
    `oldValue` VARCHAR(191) NULL,
    `newValue` VARCHAR(191) NULL,
    `changedBy` VARCHAR(191) NULL,
    `changedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inventory_transaction` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `referenceId` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Pending',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kanban_board` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kanban_column` (
    `id` VARCHAR(191) NOT NULL,
    `boardId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kanban_card` (
    `id` VARCHAR(191) NOT NULL,
    `columnId` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NULL,
    `position` INTEGER NOT NULL,
    `transactionId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `kanban_card_transactionId_key`(`transactionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `request` (
    `id` VARCHAR(191) NOT NULL,
    `requestNumber` VARCHAR(191) NOT NULL,
    `requesterName` VARCHAR(191) NOT NULL,
    `position` VARCHAR(191) NULL,
    `accountNo` VARCHAR(191) NULL,
    `businessUnit` VARCHAR(191) NULL,
    `department` VARCHAR(191) NULL,
    `purpose` VARCHAR(191) NULL,
    `chargeTo` VARCHAR(191) NULL,
    `amount` DOUBLE NOT NULL DEFAULT 0,
    `verifiedBy` VARCHAR(191) NULL,
    `approvedBy` VARCHAR(191) NULL,
    `processedBy` VARCHAR(191) NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` VARCHAR(191) NOT NULL DEFAULT 'To Verify',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `request_requestNumber_key`(`requestNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `request_item` (
    `id` VARCHAR(191) NOT NULL,
    `requestId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NULL,
    `description` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `unit` VARCHAR(191) NULL,
    `unitPrice` DOUBLE NOT NULL DEFAULT 0,
    `total` DOUBLE NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `purchase_order` ADD CONSTRAINT `purchase_order_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `supplier`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_order_item` ADD CONSTRAINT `purchase_order_item_purchaseOrderId_fkey` FOREIGN KEY (`purchaseOrderId`) REFERENCES `purchase_order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_order_item` ADD CONSTRAINT `purchase_order_item_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invoice` ADD CONSTRAINT `invoice_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invoice_item` ADD CONSTRAINT `invoice_item_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `invoice`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invoice_item` ADD CONSTRAINT `invoice_item_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_history` ADD CONSTRAINT `product_history_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventory_transaction` ADD CONSTRAINT `inventory_transaction_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kanban_column` ADD CONSTRAINT `kanban_column_boardId_fkey` FOREIGN KEY (`boardId`) REFERENCES `kanban_board`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kanban_card` ADD CONSTRAINT `kanban_card_columnId_fkey` FOREIGN KEY (`columnId`) REFERENCES `kanban_column`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kanban_card` ADD CONSTRAINT `kanban_card_transactionId_fkey` FOREIGN KEY (`transactionId`) REFERENCES `inventory_transaction`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `request_item` ADD CONSTRAINT `request_item_requestId_fkey` FOREIGN KEY (`requestId`) REFERENCES `request`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `request_item` ADD CONSTRAINT `request_item_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
