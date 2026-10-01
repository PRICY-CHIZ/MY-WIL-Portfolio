import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await requireUser();

    return NextResponse.json({
      message: "Authenticated API route.",
      user
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { message: "Authentication required." },
        { status: 401 }
      );
    }

    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}