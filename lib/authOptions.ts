import type { NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma) as NextAuthOptions['adapter'],
  providers: [
    EmailProvider({
      // Local/dev: allow missing SMTP without crashing NextAuth boot
      server: process.env.EMAIL_SERVER || undefined,
      from: process.env.EMAIL_FROM || 'kontakt@bujokmedical.pl',
      ...(process.env.EMAIL_SERVER
        ? {}
        : {
            // No-op send so missing SMTP does not throw at request time in dev
            sendVerificationRequest: async ({ identifier, url }) => {
              console.info('[auth] EMAIL_SERVER unset — magic link (dev):', identifier, url);
            },
          }),
    }),
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/logowanie',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
        token.role = dbUser?.role ?? 'PATIENT';
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.userId as string;
      }
      return session;
    },
  },
};
