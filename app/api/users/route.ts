import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  if (![Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER].includes(session.role)) {
    return NextResponse.json({ message: "Insufficient permissions." }, { status: 403 });
  }
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ users });
}
