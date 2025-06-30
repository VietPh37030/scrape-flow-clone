// Import PrismaClient từ thư viện @prisma/client
import { PrismaClient } from "./generated/prisma/client";
// import { PrismaClient } from "@prisma/client";
// Tạo biến global để lưu trữ instance PrismaClient
declare global {
  var prisma: PrismaClient | undefined;
}

// Tạo và export instance PrismaClient
const prisma = global.prisma || new PrismaClient();

// Trong môi trường phát triển, lưu instance vào biến global để tránh tạo nhiều kết nối
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;