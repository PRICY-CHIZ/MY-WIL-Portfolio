import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createSession, ROLE_HOME } from "@/lib/auth";
import { isValidEmail } from "@/lib/http";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (name.length < 2 || name.length > 80) return NextResponse.json({ message: "Name must be between 2 and 80 characters." }, { status: 400 });
    if (!isValidEmail(email)) return NextResponse.json({ message: "Enter a valid email address." }, { status: 400 });
    if (password.length < 10 || password.length > 128) return NextResponse.json({ message: "Password must be between 10 and 128 characters." }, { status: 400 });

    const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (existing) return NextResponse.json({ message: "An account with that email already exists." }, { status: 409 });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, passwordHash, role: Role.USER },
      select: { id: true, name: true, email: true, role: true },
    });
    await createSession({ userId: user.id, name: user.name, email: user.email, role: user.role });
    return NextResponse.json({ user, redirectTo: ROLE_HOME[user.role] }, { status: 201 });
  } catch (error) {
    console.error("Signup error", error);
    return NextResponse.json({ message: "Could not create account. Check your database configuration." }, { status: 500 });
  }
}
