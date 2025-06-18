// Import PrismaClient từ thư viện @prisma/client
import { PrismaClient } from "@prisma/client"

// Khai báo mở rộng global để thêm thuộc tính prisma
// Dùng để lưu trữ instance toàn cục của PrismaClient (singleton)
// Việc này giúp tránh tạo nhiều kết nối khi chạy ở môi trường dev (hot reload)
declare global {
  var prisma: PrismaClient | undefined
}

// Gán prisma = instance đã có sẵn (nếu có) hoặc tạo mới nếu chưa có
const prisma = global.prisma || new PrismaClient()

// Nếu không phải môi trường production, lưu instance vào biến toàn cục
// để tránh tạo nhiều kết nối mỗi lần code reload (ví dụ khi dùng Next.js)
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma
}

// Xuất prisma để dùng ở các file khác
export default prisma
