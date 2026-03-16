import type { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { getPrisma } from "@/lib/prisma";
import { getRequestContextFromHeaders } from "@/lib/requestContext";
import { credentialsSchema } from "@/lib/validation/auth";
import { writeAuditLog } from "@/services/auditLogService";
import { verifyPassword } from "@/services/passwordService";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(rawCredentials, req) {
        if (!isRecord(rawCredentials)) return null;
        const parsed = credentialsSchema.safeParse(rawCredentials);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;
        const context = req?.headers ? getRequestContextFromHeaders(req.headers) : null;

        const prisma = getPrisma();
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user?.passwordHash) {
          await writeAuditLog({
            action: "auth.login_failed",
            outcome: "failure",
            userId: user?.id ?? null,
            context,
            metadata: { email, reason: "no_password_or_user" },
          });
          return null;
        }
        const ok = await verifyPassword(password, user.passwordHash);
        if (!ok) {
          await writeAuditLog({
            action: "auth.login_failed",
            outcome: "failure",
            userId: user.id,
            context,
            metadata: { email, reason: "bad_password" },
          });
          return null;
        }

        await writeAuditLog({
          action: "auth.login",
          outcome: "success",
          userId: user.id,
          context,
          metadata: { email },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          image: user.image ?? undefined,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token?.sub) {
        (session.user as Session["user"] & { id: string }).id = token.sub;
      }
      return session;
    },
  },
};
