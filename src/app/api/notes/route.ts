import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const notes = await db.note.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ notes });
  } catch (error) {
    console.error("Notes fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const body = await request.json();
    const { title, encryptedNote } = body;

    if (!title || title.trim().length === 0) {
      return NextResponse.json({ error: "Note title is required" }, { status: 400 });
    }

    if (!encryptedNote || encryptedNote.trim().length === 0) {
      return NextResponse.json({ error: "Encrypted note content is required" }, { status: 400 });
    }

    const note = await db.note.create({
      data: {
        userId,
        title: title.trim(),
        encryptedNote,
      },
    });

    return NextResponse.json({ note, message: "Note saved successfully" }, { status: 201 });
  } catch (error) {
    console.error("Note creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
