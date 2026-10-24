/*
  Warnings:

  - You are about to drop the column `capacity` on the `Center` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Center` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `Center` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address` to the `Center` table without a default value. This is not possible if the table is not empty.
  - Added the required column `availableSlots` to the `Center` table without a default value. This is not possible if the table is not empty.
  - Added the required column `closingTime` to the `Center` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `Center` table without a default value. This is not possible if the table is not empty.
  - Added the required column `district` to the `Center` table without a default value. This is not possible if the table is not empty.
  - Added the required column `openingTime` to the `Center` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pincode` to the `Center` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Center` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalSlots` to the `Center` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Center` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CenterStatus" AS ENUM ('active', 'inactive');

-- AlterTable
ALTER TABLE "Center" DROP COLUMN "capacity",
DROP COLUMN "location",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "availableSlots" INTEGER NOT NULL,
ADD COLUMN     "closingTime" TEXT NOT NULL,
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "district" TEXT NOT NULL,
ADD COLUMN     "managerName" TEXT,
ADD COLUMN     "openingTime" TEXT NOT NULL,
ADD COLUMN     "pincode" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "status" "CenterStatus" NOT NULL DEFAULT 'active',
ADD COLUMN     "totalSlots" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Center_code_key" ON "Center"("code");
