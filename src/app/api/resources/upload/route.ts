import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { 
      title, description, category, resolution, tags,
      serverIp, serverPort, youtubeLink, trailerVideo, discordLink,
      fileUrl, fileName, fileSize, thumbnail, screenshots 
    } = body;

    if (!title || !description || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (category === "Server" && !serverIp) {
      return NextResponse.json({ error: "Server IP is required for server uploads" }, { status: 400 });
    }

    if (category === "Community" && !discordLink) {
      return NextResponse.json({ error: "Discord invite is required for community uploads" }, { status: 400 });
    }

    const userId = (session.user as any).id;

    if (category === "Server") {
      const server = await prisma.server.create({
        data: {
          name: title,
          ip: serverIp,
          port: Number(serverPort) || 19132,
          description,
          thumbnail: thumbnail || null,
          discordLink: discordLink || null,
          youtubeLink: youtubeLink || null,
          trailerVideo: trailerVideo || null,
          screenshots: screenshots || null,
          status: "PENDING",
        },
      });
      return NextResponse.json({ success: true, server });
    }

    if (category === "Community") {
      const community = await prisma.community.create({
        data: {
          name: title,
          discordLink,
          description,
          thumbnail: thumbnail || null,
          screenshots: screenshots || null,
          status: "PENDING",
        },
      });
      return NextResponse.json({ success: true, community });
    }

    // Handle Resources
    const resource = await prisma.resource.create({
      data: {
        title,
        description,
        category,
        resolution: resolution || null,
        tags: tags || null,
        fileUrl: fileUrl || null,
        fileName: fileName || null,
        fileSize: fileSize ? Number(fileSize) : 0,
        thumbnail: thumbnail || null,
        thumbnails: screenshots || null,
        authorId: userId,
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, resource });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
