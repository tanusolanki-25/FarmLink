import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function debug() {
  console.log("\n===== 1. ALL CENTERS =====");
  const centers = await prisma.center.findMany({ select: { id: true, centerName: true, district: true, state: true } });
  console.log(JSON.stringify(centers, null, 2));

  console.log("\n===== 2. ALL OFFICERS with center =====");
  const officers = await prisma.officer.findMany({
    include: {
      user: { select: { id: true, email: true } },
      center: { select: { id: true, centerName: true } }
    }
  });
  console.log(JSON.stringify(officers, null, 2));

  console.log("\n===== 3. ALL BOOKINGS (last 10) =====");
  const bookings = await prisma.booking.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, date: true, time: true, token: true, status: true, centerId: true,
      center: { select: { centerName: true } },
      farmer: { select: { name: true } }
    }
  });
  console.log(JSON.stringify(bookings, null, 2));

  console.log("\n===== 4. TODAY UTC RANGE CHECK =====");
  const nowIST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const yyyy = nowIST.getFullYear();
  const mm   = String(nowIST.getMonth()+1).padStart(2,'0');
  const dd   = String(nowIST.getDate()).padStart(2,'0');
  const todayStr = `${yyyy}-${mm}-${dd}`;
  const startUTC = new Date(todayStr + "T00:00:00.000Z");
  const endUTC   = new Date(todayStr + "T23:59:59.999Z");
  console.log("IST Today:", todayStr);
  console.log("Query startUTC:", startUTC.toISOString());
  console.log("Query endUTC:  ", endUTC.toISOString());

  if (bookings.length > 0) {
    console.log("\nBooking dates in DB:");
    bookings.forEach(b => {
      const d = new Date(b.date);
      console.log(`  ID=${b.id} | stored=${d.toISOString()} | center=${b.center?.centerName} | inRange=${d >= startUTC && d <= endUTC}`);
    });
  }

  console.log("\n===== 5. VARANASI CENTER BOOKINGS =====");
  const varCenter = centers.find(c => c.centerName?.toLowerCase().includes('varanasi'));
  if (varCenter) {
    console.log("Found Varanasi center ID:", varCenter.id);
    const vb = await prisma.booking.findMany({
      where: { centerId: varCenter.id },
      select: { id: true, date: true, status: true, token: true }
    });
    console.log("All bookings for this center:", JSON.stringify(vb, null, 2));
  } else {
    console.log("No Varanasi center found in DB!");
  }
}

debug().catch(console.error).finally(() => prisma.$disconnect());
