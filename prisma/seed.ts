import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const name = process.env.SUPER_ADMIN_NAME ?? "System Super Admin";
  const email = (process.env.SUPER_ADMIN_EMAIL ?? "superadmin@example.com").toLowerCase();
  const password = process.env.SUPER_ADMIN_PASSWORD;

  if (!password || password.length < 10) {
    throw new Error("Set SUPER_ADMIN_PASSWORD in .env (at least 10 characters) before seeding.");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { email },
    update: { name, passwordHash, role: Role.SUPER_ADMIN, isActive: true },
    create: { name, email, passwordHash, role: Role.SUPER_ADMIN, isActive: true },
  });

  console.log(`Super admin ready: ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
