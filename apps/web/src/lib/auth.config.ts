import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'

/**
 * Shared config without DB-backed providers. Middleware imports only this so the
 * Edge bundle does not pull in Prisma (@estateiq/database).
 * Credentials live in auth.ts and are merged for Node (API routes, server actions).
 */
export default {
  providers: [Google],
  callbacks: {
    async session({ session, token }) {
      if (token.sub) session.user.id = token.sub
      if (typeof token.email === 'string') session.user.email = token.email
      if (typeof token.name === 'string') session.user.name = token.name
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
        if (user.email) token.email = user.email
        if (user.name) token.name = user.name
      }
      return token
    },
  },
  pages: {
    signIn: '/sign-in',
    newUser: '/onboarding',
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  cookies: {
    sessionToken: {
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
} satisfies NextAuthConfig
