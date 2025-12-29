-- CreateTable
CREATE TABLE `chart_of_account` (
    `id` VARCHAR(191) NOT NULL,
    `accnt_no` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `balance` DOUBLE NULL DEFAULT 0,
    `type` VARCHAR(191) NOT NULL,
    `header` VARCHAR(191) NOT NULL,
    `bank` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `chart_of_account_accnt_no_key`(`accnt_no`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transactions` (
    `id` VARCHAR(191) NOT NULL,
    `seq` INTEGER NULL,
    `ledger` VARCHAR(191) NULL,
    `transNo` VARCHAR(191) NULL,
    `code` VARCHAR(191) NULL,
    `accountNumber` VARCHAR(191) NULL,
    `date` DATETIME(3) NULL,
    `invoiceNumber` VARCHAR(191) NULL,
    `particulars` VARCHAR(191) NULL,
    `debit` DOUBLE NULL DEFAULT 0,
    `credit` DOUBLE NULL DEFAULT 0,
    `balance` DOUBLE NULL DEFAULT 0,
    `checkAccountNumber` VARCHAR(191) NULL,
    `checkNumber` VARCHAR(191) NULL,
    `dateMatured` DATETIME(3) NULL,
    `accountName` VARCHAR(191) NULL,
    `bankName` VARCHAR(191) NULL,
    `bankBranch` VARCHAR(191) NULL,
    `user` VARCHAR(191) NULL,
    `isCoincide` BOOLEAN NULL,
    `dailyClosing` INTEGER NULL,
    `approval` VARCHAR(191) NULL,
    `ftToLedger` VARCHAR(191) NULL,
    `ftToAccount` VARCHAR(191) NULL,
    `ssma_timestamp` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `loyalty_point_setting` (
    `id` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL DEFAULT 0,
    `equivalentPoint` DOUBLE NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customer` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `customerName` VARCHAR(191) NOT NULL,
    `contactFirstName` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `phonePrimary` VARCHAR(191) NULL,
    `phoneAlternative` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `creditLimit` DOUBLE NULL DEFAULT 0,
    `isTaxExempt` BOOLEAN NOT NULL DEFAULT false,
    `paymentTerms` VARCHAR(191) NULL DEFAULT 'days',
    `paymentTermsValue` VARCHAR(191) NULL DEFAULT '30',
    `salesperson` VARCHAR(191) NULL,
    `customerGroup` VARCHAR(191) NULL DEFAULT 'default',
    `isEntitledToLoyaltyPoints` BOOLEAN NOT NULL DEFAULT false,
    `pointSetting` VARCHAR(191) NULL,
    `loyaltyCalculationMethod` VARCHAR(191) NULL DEFAULT 'automatic',
    `loyaltyCardNumber` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `customer_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `loyalty_point` (
    `id` VARCHAR(191) NOT NULL,
    `customerId` VARCHAR(191) NOT NULL,
    `loyaltyCardId` VARCHAR(191) NOT NULL,
    `totalPoints` DOUBLE NOT NULL DEFAULT 0,
    `pointSettingId` VARCHAR(191) NOT NULL,
    `expiryDate` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `barcode` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `additionalDescription` VARCHAR(191) NULL,
    `category` VARCHAR(191) NULL,
    `categoryId` VARCHAR(191) NULL,
    `subcategoryId` VARCHAR(191) NULL,
    `brandId` VARCHAR(191) NULL,
    `supplierId` VARCHAR(191) NULL,
    `unitOfMeasureId` VARCHAR(191) NULL,
    `unitPrice` DOUBLE NOT NULL DEFAULT 0,
    `costPrice` DOUBLE NOT NULL DEFAULT 0,
    `stockQuantity` INTEGER NOT NULL DEFAULT 0,
    `minStockLevel` INTEGER NOT NULL DEFAULT 0,
    `maxStockLevel` INTEGER NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `salesOrder` VARCHAR(191) NULL,
    `autoCreateChildren` BOOLEAN NOT NULL DEFAULT false,
    `initialStock` INTEGER NOT NULL DEFAULT 0,
    `reorderPoint` INTEGER NOT NULL DEFAULT 0,
    `incomeAccountId` VARCHAR(191) NULL,
    `expenseAccountId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `product_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `conversion_factor` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `unitName` VARCHAR(191) NOT NULL,
    `factor` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `brand` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `brand_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `parentCategoryId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `category_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `supplier` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `contactPerson` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `paymentTerms` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `supplier_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `unit_of_measure` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `unit_of_measure_code_key`(`code`),
    UNIQUE INDEX `unit_of_measure_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reminder` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `memo` VARCHAR(191) NULL,
    `date` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `loyalty_point` ADD CONSTRAINT `loyalty_point_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `loyalty_point` ADD CONSTRAINT `loyalty_point_pointSettingId_fkey` FOREIGN KEY (`pointSettingId`) REFERENCES `loyalty_point_setting`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
