import { PrismaClient } from "@prisma/client";

// Deklarasikan variabel global untuk menyimpan instance PrismaClient
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Inisialisasi PrismaClient.
// Di lingkungan development, Next.js akan membuat instance baru setiap kali ada hot-reload.
// Kode ini mencegah pembuatan instance berulang kali dengan menyimpannya di variabel global.
export const prisma =
  global.prisma ||
  new PrismaClient({
    // log: ["query"], // Uncomment untuk melihat query SQL di console
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}