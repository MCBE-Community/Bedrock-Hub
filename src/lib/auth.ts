import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import AzureADProvider from "next-auth/providers/azure-ad";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
    }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID || "",
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET || "",
      tenantId: "common",
      authorization: {
        params: {
          scope: "openid profile email XboxLive.signin",
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        (session.user as any).id = user.id;
        
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { gamertag: true, role: true, email: true }
        });

        const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
        
        if (dbUser?.email && adminEmails.includes(dbUser.email) && dbUser.role !== "ADMIN") {
          await prisma.user.update({
            where: { id: user.id },
            data: { role: "ADMIN" }
          });
          (session.user as any).role = "ADMIN";
        } else {
          (session.user as any).role = dbUser?.role || "USER";
        }

        (session.user as any).gamertag = dbUser?.gamertag;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
  },
};
