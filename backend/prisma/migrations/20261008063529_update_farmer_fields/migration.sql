/*
  Warnings:

  - You are about to drop the column `aadhaarNumber` on the `Farmer` table. All the data in the column will be lost.
  - Added the required column `name` to the `Farmer` table without a default value. This is not possible if the table is not empty.
  - Made the column `address` on table `Farmer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `village` on table `Farmer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `district` on table `Farmer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `state` on table `Farmer` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Farmer" DROP COLUMN "aadhaarNumber",
ADD COLUMN     "adhaarNumber" TEXT,
ADD COLUMN     "fatherName" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "village" SET NOT NULL,
ALTER COLUMN "district" SET NOT NULL,
ALTER COLUMN "state" SET NOT NULL;
