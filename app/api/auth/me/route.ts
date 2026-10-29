import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
  });
  if (!user || !user.isActive) return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  return NextResponse.json({ user });
}
