CREATE TABLE `batches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`batchNumber` varchar(100) NOT NULL,
	`recipeId` int NOT NULL,
	`productId` int NOT NULL,
	`quantity` int NOT NULL,
	`unit` varchar(50) NOT NULL,
	`status` enum('planned','in_progress','completed','failed','on_hold') NOT NULL DEFAULT 'planned',
	`startDate` timestamp,
	`endDate` timestamp,
	`location` varchar(255),
	`qrCode` text,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `batches_id` PRIMARY KEY(`id`),
	CONSTRAINT `batches_batchNumber_unique` UNIQUE(`batchNumber`)
);
--> statement-breakpoint
CREATE TABLE `inventoryTransactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`materialId` int NOT NULL,
	`transactionType` enum('receipt','shipment','adjustment','production','return') NOT NULL,
	`quantity` int NOT NULL,
	`unit` varchar(50) NOT NULL,
	`referenceType` varchar(50),
	`referenceId` int,
	`location` varchar(255),
	`notes` text,
	`performedBy` int NOT NULL,
	`transactionDate` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `inventoryTransactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `materials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`sku` varchar(100) NOT NULL,
	`type` enum('raw_material','finished_product','component') NOT NULL,
	`description` text,
	`unit` varchar(50) NOT NULL,
	`unitPrice` int DEFAULT 0,
	`reorderLevel` int DEFAULT 0,
	`currentStock` int DEFAULT 0,
	`supplierId` int,
	`category` varchar(100),
	`imageUrl` text,
	`status` enum('active','discontinued','out_of_stock') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `materials_id` PRIMARY KEY(`id`),
	CONSTRAINT `materials_sku_unique` UNIQUE(`sku`)
);
--> statement-breakpoint
CREATE TABLE `orderItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`productId` int NOT NULL,
	`quantity` int NOT NULL,
	`unit` varchar(50) NOT NULL,
	`unitPrice` int NOT NULL,
	`totalPrice` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `orderItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderNumber` varchar(100) NOT NULL,
	`customerName` varchar(255) NOT NULL,
	`customerEmail` varchar(320),
	`customerPhone` varchar(50),
	`shippingAddress` text,
	`orderDate` timestamp NOT NULL DEFAULT (now()),
	`requestedDeliveryDate` timestamp,
	`status` enum('pending','processing','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
	`totalAmount` int DEFAULT 0,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `orders_orderNumber_unique` UNIQUE(`orderNumber`)
);
--> statement-breakpoint
CREATE TABLE `purchaseOrderItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`purchaseOrderId` int NOT NULL,
	`materialId` int NOT NULL,
	`quantity` int NOT NULL,
	`unit` varchar(50) NOT NULL,
	`unitPrice` int NOT NULL,
	`totalPrice` int NOT NULL,
	`receivedQuantity` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `purchaseOrderItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `purchaseOrders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderNumber` varchar(100) NOT NULL,
	`supplierId` int NOT NULL,
	`orderDate` timestamp NOT NULL DEFAULT (now()),
	`expectedDeliveryDate` timestamp,
	`actualDeliveryDate` timestamp,
	`status` enum('draft','submitted','confirmed','shipped','delivered','cancelled') NOT NULL DEFAULT 'draft',
	`totalAmount` int DEFAULT 0,
	`notes` text,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `purchaseOrders_id` PRIMARY KEY(`id`),
	CONSTRAINT `purchaseOrders_orderNumber_unique` UNIQUE(`orderNumber`)
);
--> statement-breakpoint
CREATE TABLE `recipeIngredients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`recipeId` int NOT NULL,
	`materialId` int NOT NULL,
	`quantity` int NOT NULL,
	`unit` varchar(50) NOT NULL,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `recipeIngredients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `recipes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`code` varchar(100) NOT NULL,
	`productId` int NOT NULL,
	`version` varchar(50) NOT NULL DEFAULT '1.0',
	`description` text,
	`yieldQuantity` int NOT NULL,
	`yieldUnit` varchar(50) NOT NULL,
	`status` enum('draft','active','archived') NOT NULL DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `recipes_id` PRIMARY KEY(`id`),
	CONSTRAINT `recipes_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `shipments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`shipmentNumber` varchar(100) NOT NULL,
	`type` enum('inbound','outbound') NOT NULL,
	`status` enum('pending','in_transit','delivered','cancelled') NOT NULL DEFAULT 'pending',
	`origin` text,
	`destination` text,
	`carrier` varchar(255),
	`trackingNumber` varchar(255),
	`estimatedArrival` timestamp,
	`actualArrival` timestamp,
	`notes` text,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `shipments_id` PRIMARY KEY(`id`),
	CONSTRAINT `shipments_shipmentNumber_unique` UNIQUE(`shipmentNumber`)
);
--> statement-breakpoint
CREATE TABLE `suppliers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`code` varchar(100) NOT NULL,
	`contactPerson` varchar(255),
	`email` varchar(320),
	`phone` varchar(50),
	`address` text,
	`country` varchar(100),
	`status` enum('active','inactive','suspended') NOT NULL DEFAULT 'active',
	`rating` int DEFAULT 0,
	`certifications` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `suppliers_id` PRIMARY KEY(`id`),
	CONSTRAINT `suppliers_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `warehouseLocations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`code` varchar(100) NOT NULL,
	`type` enum('warehouse','zone','aisle','rack','bin') NOT NULL,
	`parentId` int,
	`capacity` int,
	`currentUtilization` int DEFAULT 0,
	`address` text,
	`status` enum('active','inactive','maintenance') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `warehouseLocations_id` PRIMARY KEY(`id`),
	CONSTRAINT `warehouseLocations_code_unique` UNIQUE(`code`)
);
