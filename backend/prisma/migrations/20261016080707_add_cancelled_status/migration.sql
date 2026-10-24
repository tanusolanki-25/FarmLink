-- DropForeignKey
ALTER TABLE "Procurement" DROP CONSTRAINT "Procurement_bookingId_fkey";

-- AlterTable
ALTER TABLE "Officer" ADD COLUMN     "name" TEXT;

-- AddForeignKey
ALTER TABLE "Procurement" ADD CONSTRAINT "Procurement_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
