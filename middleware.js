import { withAuth } from "next-auth/middleware"

// More on how NextAuth.js middleware works: https://next-auth.js.org/configuration/nextjs#middleware
export default withAuth({
  callbacks: {
    authorized({ req, token }) {
        console.log('withAuth::authorized()', { req, token });

        if (!token) {
            return '/auth/signin';
        }

        // `/admin` requires admin role
        if (!token.isAdmin) {
            return '/auth/signin';
        }
      
        return true;
    },
  },
})

export const config = {
    matcher: [
        "/admin/:path*",
        "/api/auth/approve-account",
    ]
}
