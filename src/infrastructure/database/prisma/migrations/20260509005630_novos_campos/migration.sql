/*
  Warnings:

  - You are about to drop the column `colorId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `materialId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `nlpProductId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `sizeId` on the `Product` table. All the data in the column will be lost.
  - You are about to alter the column `barcode` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(13)`.
  - You are about to drop the column `isActive` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Estoque` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Loja` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[sku]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[barcode]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[productId,stockId]` on the table `ProductStock` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `normalizedName` to the `Color` table without a default value. This is not possible if the table is not empty.
  - Added the required column `normalizedName` to the `Material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `normalizedName` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Added the required column `normalizedName` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `size` on the `Size` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `nickname` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `normalizedName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProductSize" AS ENUM ('P', 'M', 'G', 'GG', 'XG');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('PRODUCT', 'KIT', 'PACKAGE');

-- CreateEnum
CREATE TYPE "StockMovimentType" AS ENUM ('INBOUND', 'OUTBOUND', 'TRANSFER');

-- DropForeignKey
ALTER TABLE "Estoque" DROP CONSTRAINT "Estoque_storeId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_colorId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_materialId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_sizeId_fkey";

-- DropForeignKey
ALTER TABLE "ProductStock" DROP CONSTRAINT "ProductStock_stockId_fkey";

-- AlterTable
ALTER TABLE "Color" ADD COLUMN     "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMPTZ(6),
ADD COLUMN     "normalizedName" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Material" ADD COLUMN     "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMPTZ(6),
ADD COLUMN     "normalizedName" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Model" ADD COLUMN     "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMPTZ(6),
ADD COLUMN     "normalizedName" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "colorId",
DROP COLUMN "materialId",
DROP COLUMN "nlpProductId",
DROP COLUMN "sizeId",
ADD COLUMN     "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMPTZ(6),
ADD COLUMN     "mlProductId" TEXT,
ADD COLUMN     "normalizedName" TEXT NOT NULL,
ADD COLUMN     "size" "ProductSize",
ADD COLUMN     "type" "ProductType" NOT NULL DEFAULT 'PRODUCT',
ADD COLUMN     "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "barcode" DROP NOT NULL,
ALTER COLUMN "barcode" SET DATA TYPE CHAR(13),
ALTER COLUMN "modelId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ProductStock" ADD COLUMN     "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMPTZ(6),
ADD COLUMN     "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Size" DROP COLUMN "size",
ADD COLUMN     "size" "ProductSize" NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isActive",
ADD COLUMN     "deletedAt" TIMESTAMPTZ(6),
ADD COLUMN     "nickname" TEXT NOT NULL,
ADD COLUMN     "normalizedName" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(6);

-- DropTable
DROP TABLE "Estoque";

-- DropTable
DROP TABLE "Loja";

-- DropEnum
DROP TYPE "ItemSize";

-- CreateTable
CREATE TABLE "ProductComponent" (
    "id" TEXT NOT NULL,
    "parentProductId" TEXT NOT NULL,
    "componentProductId" TEXT NOT NULL,
    "quantity" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "ProductComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stock" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "StockType" NOT NULL,
    "storeId" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "Estoque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Store" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "Loja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductColor" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "colorId" TEXT NOT NULL,

    CONSTRAINT "ProductColor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductMaterial" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,

    CONSTRAINT "ProductMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockMoviment" (
    "id" UUID NOT NULL,
    "fromStockId" TEXT,
    "toStockid" TEXT,
    "productStockId" TEXT NOT NULL,
    "type" "StockMovimentType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "StockMoviment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "fki_ProductComponent_componentProductId_fkey" ON "ProductComponent"("componentProductId");

-- CreateIndex
CREATE INDEX "fki_ProductComponent_parentProductId_fkey" ON "ProductComponent"("parentProductId");

-- CreateIndex
CREATE INDEX "fki_ProductColor_colorId_fkey" ON "ProductColor"("colorId");

-- CreateIndex
CREATE INDEX "fki_ProductColor_productId_fkey" ON "ProductColor"("productId");

-- CreateIndex
CREATE INDEX "fki_ProductMaterial_materialId_fkey" ON "ProductMaterial"("materialId");

-- CreateIndex
CREATE INDEX "fki_ProductMaterial_productId_fkey" ON "ProductMaterial"("productId");

-- CreateIndex
CREATE INDEX "fki_StockMoviment_fromStockId_fkey" ON "StockMoviment"("fromStockId");

-- CreateIndex
CREATE INDEX "fki_StockMoviment_productStockId_fkey" ON "StockMoviment"("productStockId");

-- CreateIndex
CREATE INDEX "fki_StockMoviment_toStockId_fkey" ON "StockMoviment"("toStockid");

-- CreateIndex
CREATE INDEX "fki_StockMoviment_userId_fkey" ON "StockMoviment"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "product_sku_unique" ON "Product"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "product_barcode_unique" ON "Product"("barcode");

-- CreateIndex
CREATE INDEX "idx_product_model" ON "Product"("modelId");

-- CreateIndex
CREATE INDEX "idx_productstock_product" ON "ProductStock"("productId");

-- CreateIndex
CREATE INDEX "idx_productstock_stock" ON "ProductStock"("stockId");

-- CreateIndex
CREATE UNIQUE INDEX "uq_productstock_product_stock" ON "ProductStock"("productId", "stockId");

-- AddForeignKey
ALTER TABLE "ProductStock" ADD CONSTRAINT "ProductStock_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductComponent" ADD CONSTRAINT "ProductComponent_componentProductId_fkey" FOREIGN KEY ("componentProductId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductComponent" ADD CONSTRAINT "ProductComponent_parentProductId_fkey" FOREIGN KEY ("parentProductId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Estoque_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductColor" ADD CONSTRAINT "ProductColor_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductColor" ADD CONSTRAINT "ProductColor_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductMaterial" ADD CONSTRAINT "ProductMaterial_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductMaterial" ADD CONSTRAINT "ProductMaterial_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMoviment" ADD CONSTRAINT "StockMoviment_fromStockId_fkey" FOREIGN KEY ("fromStockId") REFERENCES "Stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMoviment" ADD CONSTRAINT "StockMoviment_productStockId_fkey" FOREIGN KEY ("productStockId") REFERENCES "ProductStock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMoviment" ADD CONSTRAINT "StockMoviment_toStockId_fkey" FOREIGN KEY ("toStockid") REFERENCES "Stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMoviment" ADD CONSTRAINT "StockMoviment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
