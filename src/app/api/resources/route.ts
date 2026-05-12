import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const resolution = searchParams.get("resolution") || "";
    const version = searchParams.get("version") || "";
    const sort = searchParams.get("sort") || "recent";
    const dateRange = searchParams.get("date") || "all";

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
    if (version) {
      where.versions = {
        some: { version: { contains: version } }
      };
    }

    if (dateRange !== "all") {
      const date = new Date();
      if (dateRange === "day") date.setDate(date.getDate() - 1);
      if (dateRange === "week") date.setDate(date.getDate() - 7);
      if (dateRange === "month") date.setMonth(date.getMonth() - 1);
      where.createdAt = { gte: date };
    }

    let orderBy: any = { createdAt: "desc" };
    if (sort === "popular") orderBy = { downloads: "desc" };
    if (sort === "views") orderBy = { views: "desc" };
    if (sort === "rating") orderBy = { reviews: { _count: "desc" } };

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
