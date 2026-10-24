-- DropForeignKey
ALTER TABLE "Queue" DROP CONSTRAINT "Queue_bookingId_fkey";

-- AddForeignKey
ALTER TABLE "Queue" ADD CONSTRAINT "Queue_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
