import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();
  const name = typeof body.name === "string" ? body.name.trim() : undefined;
  const bio = typeof body.bio === "string" ? body.bio.trim() : undefined;
  const website = typeof body.website === "string" ? body.website.trim() : undefined;
  const twitter = typeof body.twitter === "string" ? body.twitter.trim() : undefined;
  const discord = typeof body.discord === "string" ? body.discord.trim() : undefined;

  if (!name && !bio && !website && !twitter && !discord) {
    return NextResponse.json({ error: "No profile data provided" }, { status: 400 });
  }

  try {
    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(name ? { name } : {}),
        ...(bio ? { bio } : {}),
        ...(website ? { website } : {}),
        ...(twitter ? { twitter } : {}),
        ...(discord ? { discord } : {}),
      },
    });

    return NextResponse.json({ success: true, user: { name: updated.name } });
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Unable to update profile." }, { status: 500 });
  }
}
