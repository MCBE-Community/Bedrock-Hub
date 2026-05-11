import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const resolution = searchParams.get("resolution") || "";
    const sort = searchParams.get("sort") || "recent";

    const where: any = { status: "APPROVED" };
    if (q) {
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
        { tags: { contains: q } },
      ];
    }
    if (category) where.category = category;
    if (resolution) where.resolution = resolution;

    const orderBy: any = sort === "popular"
      ? { downloads: "desc" }
      : { createdAt: "desc" };

    const resources = await prisma.resource.findMany({
      where,
      orderBy,
      include: {
        author: { select: { name: true, image: true } },
      },
      take: 50,
    });

    return NextResponse.json(resources);
  } catch (error) {
    console.error("Resources fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 });
  }
}
