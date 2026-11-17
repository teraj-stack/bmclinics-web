import type { NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './prisma';

export const AUTH_SECRET = process.env.NEXTAUTH_SECRET;

export const authOptions: NextAuthOptions = {
  secret: AUTH_SECRET,
  ...(process.env.EMAIL_SERVER && process.env.DATABASE_URL
    ? { adapter: PrismaAdapter(prisma) as NextAuthOptions['adapter'] }
    : {}),
  providers: [
    // Interactive credentials login is disabled until verified credentials and
    // server-side role authorization are implemented. Use configured email login.
    ...(process.env.EMAIL_SERVER && process.env.DATABASE_URL
      ? [
          EmailProvider({
            server: process.env.EMAIL_SERVER,
            from: process.env.EMAIL_FROM || 'kontakt@bujokmedical.pl',
          }),
        ]
      : []),
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/logowanie',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Resolve role from the trusted database rather than user-supplied input.
        const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { role: true } });
        token.role = dbUser?.role ?? 'PATIENT';
        token.userId = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = (token.role as string) || 'PATIENT';
        session.user.id = (token.userId as string) || 'usr-unknown';
      }
      return session;
    },
  },
};
