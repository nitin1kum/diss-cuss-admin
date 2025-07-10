import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Additional middleware logic can go here
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return token?.role === "ADMIN"
      },
    },
  }
)

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|auth).*)",
  ]
}