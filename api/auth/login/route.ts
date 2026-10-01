import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  setAuthCookie,
  verifyPassword,
  type AuthUser
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    const result = await db.query(
      `SELECT id, name, email, password_hash, role
       FROM users
       WHERE email = $1`,
      [email]
    );

    if (!result.rowCount) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const row = result.rows[0];
    const valid = await verifyPassword(password, row.password_hash);

    if (!valid) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const user: AuthUser = {
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role
    };

    await setAuthCookie(user);

    return NextResponse.json({
      message: "Login successful.",
      user
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error while logging in." },
      { status: 500 }
    );
  }
}