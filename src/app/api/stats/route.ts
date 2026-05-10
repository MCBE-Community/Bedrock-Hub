import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [resourceCount, totalDownloads, creatorCount] = await Promise.all([
      prisma.resource.count(),
      prisma.resource.aggregate({
        _sum: { downloads: true },
      }),
      prisma.user.count({
        where: {
          resources: {
            some: {},
          },
        },
      }),
    ]);

    return NextResponse.json({
      resources: resourceCount,
      downloads: totalDownloads._sum.downloads || 0,
      creators: creatorCount,
    });
  } catch (error) {
    console.error("Stats fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
