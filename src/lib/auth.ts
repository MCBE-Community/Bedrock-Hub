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
          select: { gamertag: true, role: true, email: true, username: true, onboardingComplete: true }
        });

        const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
        
        if (dbUser?.email) {
          const isAdminEmail = adminEmails.includes(dbUser.email);
          if (isAdminEmail && dbUser.role !== "ADMIN") {
            await prisma.user.update({ where: { id: user.id }, data: { role: "ADMIN" } });
            (session.user as any).role = "ADMIN";
          } else if (!isAdminEmail && dbUser.role === "ADMIN") {
            await prisma.user.update({ where: { id: user.id }, data: { role: "USER" } });
            (session.user as any).role = "USER";
          } else {
            (session.user as any).role = dbUser.role;
          }
        } else {
          (session.user as any).role = dbUser?.role || "USER";
        }

        let currentGamertag = dbUser?.gamertag;

        // Auto-sync gamertag from Microsoft/Xbox profile if they connected it
        if (!currentGamertag && user.name) {
          const azureAccount = await prisma.account.findFirst({
            where: { userId: user.id, provider: 'azure-ad' }
          });
          if (azureAccount) {
            await prisma.user.update({ where: { id: user.id }, data: { gamertag: user.name } });
            currentGamertag = user.name;
          }
        }

        (session.user as any).gamertag = currentGamertag;
        (session.user as any).username = dbUser?.username;
        (session.user as any).onboardingComplete = dbUser?.onboardingComplete;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
  },
};
