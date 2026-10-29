import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  if (![Role.SUPER_ADMIN, Role.ADMIN].includes(session.role)) {
    return NextResponse.json({ message: "Insufficient permissions." }, { status: 403 });
  }
  const [totalUsers, activeUsers, roleCounts] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isActive: true } }),
    prisma.user.groupBy({ by: ["role"], _count: { _all: true } }),
  ]);
  return NextResponse.json({
    message: "Admin dashboard summary",
    stats: { totalUsers, activeUsers, usersByRole: Object.fromEntries(roleCounts.map((item) => [item.role, item._count._all])) },
  });
}
