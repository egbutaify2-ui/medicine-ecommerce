import { prisma } from "../lib/prisma";

async function promoteExistingUserToAdmin() {
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
  if (!email) throw new Error("Set BOOTSTRAP_ADMIN_EMAIL to an existing registered user's email before running this script.");
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("No account exists for BOOTSTRAP_ADMIN_EMAIL. Sign up first, then run this script.");
  await prisma.user.update({ where: { id: user.id }, data: { role: "ADMIN", status: "ACTIVE", emailVerified: true } });
  console.log(`Promoted the existing account ${email} to ADMIN.`);
}

promoteExistingUserToAdmin()
  .catch((error) => { console.error("Admin promotion failed:", error); process.exitCode = 1; })
  .finally(async () => { await prisma.$disconnect(); });
