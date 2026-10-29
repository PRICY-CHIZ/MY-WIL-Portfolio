import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  if (![Role.SUPER_ADMIN, Role.ADMIN].includes(session.role)) {
    return NextResponse.json({ message: "Insufficient permissions." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const userId = typeof body.userId === "string" ? body.userId : "";
    const nextRole = body.role as Role;
    const isActive = body.isActive;
    const target = await prisma.user.findUnique({ where: { id: userId } });
    if (!target) return NextResponse.json({ message: "User not found." }, { status: 404 });

    const validRoles = Object.values(Role);
    if (nextRole !== undefined && !validRoles.includes(nextRole)) {
      return NextResponse.json({ message: "Invalid role." }, { status: 400 });
    }
    if (session.role !== Role.SUPER_ADMIN && (target.role === Role.SUPER_ADMIN || nextRole === Role.SUPER_ADMIN)) {
      return NextResponse.json({ message: "Only a Super Admin can manage Super Admin accounts." }, { status: 403 });
    }
    if (session.userId === target.id && isActive === false) {
      return NextResponse.json({ message: "You cannot deactivate your own account." }, { status: 400 });
    }
    if (session.userId === target.id && nextRole && nextRole !== session.role) {
      return NextResponse.json({ message: "You cannot change your own role." }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(nextRole ? { role: nextRole } : {}),
        ...(typeof isActive === "boolean" ? { isActive } : {}),
      },
      select: { id: true, name: true, email: true, role: true, isActive: true },
    });
    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error("Admin user update error", error);
    return NextResponse.json({ message: "Could not update user." }, { status: 400 });
  }
}
