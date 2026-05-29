import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Token dan kata sandi diperlukan." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Kata sandi minimal 8 karakter." }, { status: 400 });
    }

    // 1. Hash token mentah yang diterima dari URL untuk dicocokkan dengan yang ada di DB
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // 2. Cari pengguna berdasarkan token yang sudah di-hash dan belum kedaluwarsa
    const user = await db.user.findFirst({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordTokenExpiry: {
          gt: new Date(), // Pastikan token belum kedaluwarsa
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Token tidak valid atau sudah kedaluwarsa." }, { status: 400 });
    }

    // 3. Hash kata sandi baru
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Perbarui kata sandi pengguna dan hapus token reset dari database
    await db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordTokenExpiry: null,
      },
    });

    return NextResponse.json({ message: "Kata sandi berhasil direset." });

  } catch (error) {
    console.error("[RESET_PASSWORD_ERROR]", error);
    return NextResponse.json({ error: "Terjadi kesalahan internal." }, { status: 500 });
  }
}