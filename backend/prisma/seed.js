import  prisma  from "../src/lib/prisma.js";
import bcrypt from "bcrypt"

const adminPassword = await bcrypt.hash("Admin@123", 10);


async function main() {
await prisma.user.create({
  data: {
    email: "admin@farmlink.in",
    phone: "9876500001",
    passwordHash: adminPassword,
    role: "admin",
    verified: true,
  },
});
  console.log("Seed done");
  console.log("Admin   -> admin@farmlink.com / Admin@123");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());