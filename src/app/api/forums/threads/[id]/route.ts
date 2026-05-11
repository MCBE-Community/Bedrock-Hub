import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const thread = await prisma.forumThread.findUnique({
      where: { id: params.id },
      include: {
        author: { select: { name: true, image: true } },
        category: { select: { name: true } },
        posts: {
          include: {
            author: { select: { name: true, image: true } }
          },
          orderBy: { createdAt: "asc" }
        }
      }
    });

    if (!thread) return NextResponse.json({ error: "Thread not found" }, { status: 404 });

    return NextResponse.json({ thread });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
