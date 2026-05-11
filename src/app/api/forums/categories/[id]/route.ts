import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const category = await prisma.forumCategory.findUnique({
      where: { id: params.id }
    });

    if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });

    const threads = await prisma.forumThread.findMany({
      where: { categoryId: params.id },
      include: {
        author: { select: { name: true } },
        _count: { select: { posts: true } }
      },
      orderBy: [
        { isPinned: "desc" },
        { createdAt: "desc" }
      ]
    });

    return NextResponse.json({ category, threads });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
