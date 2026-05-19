import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { hashPassword, validatePassword, validateEmail } from "@/lib/password";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const body = await request.json();
    const { username, email } = body;

    // Validate inputs
    if (username && username.trim().length < 3) {
      return NextResponse.json(
        { error: "Username must be at least 3 characters" },
        { status: 400 }
      );
    }

    if (email) {
      const emailValidation = validateEmail(email);
      if (!emailValidation.valid) {
        return NextResponse.json({ error: emailValidation.message }, { status: 400 });
      }
    }

    // Check for existing username/email
    if (username || email) {
      const existing = await db.user.findFirst({
        where: {
          OR: [
            ...(username ? [{ username: username.trim() }] : []),
            ...(email ? [{ email: email.trim().toLowerCase() }] : []),
          ],
          NOT: { id: userId },
        },
      });

      if (existing) {
        return NextResponse.json(
          { error: "Username or email already taken" },
          { status: 409 }
        );
      }
    }

    const updateData: { username?: string; email?: string } = {};
    if (username) updateData.username = username.trim();
    if (email) updateData.email = email.trim().toLowerCase();

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user: updatedUser, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
