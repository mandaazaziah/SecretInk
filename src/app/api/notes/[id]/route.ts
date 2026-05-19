import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const { id } = await params;

    const note = await db.note.findFirst({
      where: { id, userId },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json({ note });
  } catch (error) {
    console.error("Note fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const { id } = await params;
    const body = await request.json();
    const { title, encryptedNote } = body;

    const existingNote = await db.note.findFirst({
      where: { id, userId },
    });

    if (!existingNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    const updateData: { title?: string; encryptedNote?: string } = {};
    if (title) updateData.title = title.trim();
    if (encryptedNote) updateData.encryptedNote = encryptedNote;

    const updatedNote = await db.note.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ note: updatedNote, message: "Note updated successfully" });
  } catch (error) {
    console.error("Note update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const { id } = await params;

    const existingNote = await db.note.findFirst({
      where: { id, userId },
    });

    if (!existingNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    await db.note.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Note deletion error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
