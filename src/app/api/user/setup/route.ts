import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const data = await req.json();
    const { username, bio, youtube, twitch, twitter, website, skip } = data;

    if (skip) {
      // Just mark onboarding as complete
      await prisma.user.update({
        where: { id: userId },
        data: { onboardingComplete: true },
      });
      return NextResponse.json({ success: true });
    }

    // Validate username if provided
    if (username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username: username,
          id: { not: userId } // exclude current user
        }
      });

      if (existingUser) {
        return NextResponse.json({ error: "Username is already taken" }, { status: 400 });
      }
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        username: username || undefined,
        bio: bio || null,
        youtube: youtube || null,
        twitch: twitch || null,
        twitter: twitter || null,
        website: website || null,
        onboardingComplete: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Setup API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
