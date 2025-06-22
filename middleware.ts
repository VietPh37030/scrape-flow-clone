import { authMiddleware } from '@clerk/nextjs/server'

// Danh sách các trang công khai
const publicRoutes = [
  '/sign-in(.*)',
  '/sign-up(.*)'
]

export default authMiddleware({
  publicRoutes,
  afterAuth(auth, req) {
    // Nếu người dùng chưa đăng nhập và đang truy cập trang không công khai, chuyển hướng họ đến trang đăng nhập
    if (!auth.userId && !auth.isPublicRoute) {
      const signInUrl = new URL('/sign-in', req.url)
      return Response.redirect(signInUrl)
    }
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}