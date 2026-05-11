import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = (session.user as any).id;
    const { content, threadId } = await req.json();

    if (!content || !threadId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const post = await prisma.forumPost.create({
      data: {
        content,
        threadId,
        authorId: userId
      }
    });

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
