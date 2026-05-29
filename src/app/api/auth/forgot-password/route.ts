import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 
import bcrypt from "bcryptjs"; // Atau sesuaikan dengan library hash yang kamu pakai

export async function POST(req: Request) {
  try {
    // Sekarang kita menerima email DAN newPassword dari frontend
    const { email, newPassword } = await req.json();

    if (!email || !newPassword) {
      return NextResponse.json({ error: "Email dan kata sandi baru diperlukan" }, { status: 400 });
    }

    // 1. Cek apakah email tersebut ada di database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "Email tidak ditemukan di sistem." }, { status: 404 });
    }

    // 2. Hash password yang baru (PENTING AGAR AMAN DI DATABASE)
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 3. Langsung timpa password lama dengan yang baru di database
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        // Kita kosongkan token reset karena tidak dipakai
        resetPasswordToken: null,
        resetPasswordTokenExpiry: null,
      },
    });

    return NextResponse.json({ message: "Kata sandi berhasil diperbarui!" }, { status: 200 });

  } catch (error) {
    console.error("DIRECT_RESET_ERROR", error);
    return NextResponse.json({ error: "Terjadi kesalahan internal." }, { status: 500 });
  }
}