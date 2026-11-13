import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './prisma';

export const AUTH_SECRET =
  process.env.NEXTAUTH_SECRET || 'bmclinics-live-cms-secret-2026-mlasers0110';

const ADMIN_EMAILS = new Set([
  'mlasers0110@icloud.com',
  'admin@bmclinic.net',
  'kontakt@bujokmedical.pl',
]);

export const authOptions: NextAuthOptions = {
  secret: AUTH_SECRET,
  ...(process.env.EMAIL_SERVER && process.env.DATABASE_URL
    ? { adapter: PrismaAdapter(prisma) as NextAuthOptions['adapter'] }
    : {}),
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Logowanie bezpośrednie (Online / CMS)',
      credentials: {
        email: { label: 'E-mail', type: 'email' },
        role: { label: 'Rola', type: 'text' },
        accessCode: { label: 'Kod dostępu (opcjonalnie)', type: 'password' },
      },
      async authorize(credentials) {
        const rawEmail = (credentials?.email || 'mlasers0110@icloud.com').trim().toLowerCase();
        if (!rawEmail) return null;

        const requestedRole = credentials?.role as 'ADMIN' | 'DOCTOR' | 'PATIENT' | undefined;
        let resolvedRole: 'ADMIN' | 'DOCTOR' | 'PATIENT' = 'PATIENT';

        if (ADMIN_EMAILS.has(rawEmail) || requestedRole === 'ADMIN') {
          resolvedRole = 'ADMIN';
        } else if (rawEmail.includes('lekarz') || rawEmail.includes('bujok') || requestedRole === 'DOCTOR') {
          resolvedRole = 'DOCTOR';
        } else if (requestedRole) {
          resolvedRole = requestedRole;
        }

        // Try reading user from DB if configured, otherwise return direct JWT user
        if (process.env.DATABASE_URL) {
          try {
            const dbUser = await prisma.user.findUnique({ where: { email: rawEmail } });
            if (dbUser) {
              return {
                id: dbUser.id,
                email: dbUser.email,
                name: dbUser.name ?? rawEmail.split('@')[0],
                role: (requestedRole || dbUser.role || resolvedRole) as string,
              };
            }
          } catch {
            // DB unreachable — continue with stateless JWT auth
          }
        }

        return {
          id: resolvedRole === 'DOCTOR' ? 'dr-jan-bujok' : `usr-${rawEmail.replace(/[^a-z0-9]/g, '-')}`,
          email: rawEmail,
          name:
            rawEmail === 'mlasers0110@icloud.com'
              ? 'Administrator (mlasers0110)'
              : resolvedRole === 'DOCTOR'
                ? 'dr Jan Bujok'
                : rawEmail.split('@')[0],
          role: resolvedRole,
        };
      },
    }),
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
        const customRole = (user as { role?: string }).role;
        token.role = customRole ?? 'ADMIN';
        token.userId = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = (token.role as string) || 'ADMIN';
        session.user.id = (token.userId as string) || 'usr-admin';
      }
      return session;
    },
  },
};
