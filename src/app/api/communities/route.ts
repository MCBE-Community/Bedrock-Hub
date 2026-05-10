import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const sort = searchParams.get("sort") || "likes";

    const where: any = {};
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }

    const orderBy: any = sort === "likes"
      ? { likes: { _count: "desc" } }
      : { createdAt: "desc" };

    const communities = await prisma.community.findMany({
      where,
      orderBy,
      include: {
        likes: { select: { id: true } },
      },
      take: 50,
    });

    const result = communities.map(c => ({
      ...c,
      likeCount: c.likes.length,
      likes: undefined,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Communities fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch communities" }, { status: 500 });
  }
}
