import { NextRequest, NextResponse } from "next/server";
import { decrypt, validateEncryptionKey } from "@/lib/aes";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { encryptedData, encryptionKey } = body;

    if (!encryptedData || encryptedData.trim().length === 0) {
      return NextResponse.json({ error: "Encrypted data is required" }, { status: 400 });
    }

    const keyValidation = validateEncryptionKey(encryptionKey);
    if (!keyValidation.valid) {
      return NextResponse.json({ error: keyValidation.message }, { status: 400 });
    }

    const decrypted = decrypt(encryptedData, encryptionKey);

    return NextResponse.json({
      decrypted,
      message: "Text decrypted successfully",
    });
  } catch (error) {
    console.error("Decryption error:", error);
    return NextResponse.json(
      { error: "Dekripsi gagal. Kunci enkripsi salah silahkan coba lagi." },
      { status: 400 }
    );
  }
}

