import { NextRequest, NextResponse } from "next/server";
import { encrypt, validateEncryptionKey } from "@/lib/aes";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plaintext, encryptionKey } = body;

    if (!plaintext || plaintext.trim().length === 0) {
      return NextResponse.json({ error: "Text to encrypt is required" }, { status: 400 });
    }

    const keyValidation = validateEncryptionKey(encryptionKey);
    if (!keyValidation.valid) {
      return NextResponse.json({ error: keyValidation.message }, { status: 400 });
    }

    const encrypted = encrypt(plaintext, encryptionKey);

    return NextResponse.json({
      encrypted,
      message: "Text encrypted successfully",
    });
  } catch (error) {
    console.error("Encryption error:", error);
    return NextResponse.json({ error: "Encryption failed" }, { status: 500 });
  }
}
