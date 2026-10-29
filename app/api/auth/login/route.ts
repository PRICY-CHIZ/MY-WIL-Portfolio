import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession, ROLE_HOME } from "@/lib/auth";
import { isValidEmail } from "@/lib/http";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (!isValidEmail(email) || !password) return NextResponse.json({ message: "Enter your email and password." }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive || !(await bcrypt.compare(password, user.passwordHash))) {
      return NextResponse.json({ message: "Email or password is incorrect." }, { status: 401 });
    }
    await createSession({ userId: user.id, name: user.name, email: user.email, role: user.role });
    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      redirectTo: ROLE_HOME[user.role],
    });
  } catch (error) {
    console.error("Login error", error);
    return NextResponse.json({ message: "Could not log in. Check server configuration." }, { status: 500 });
  }
}
