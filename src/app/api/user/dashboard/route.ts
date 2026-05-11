import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    // Fetch user creations
    const uploads = await prisma.resource.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: "desc" },
    });

    // Calculate stats
    const totalDownloads = uploads.reduce((acc, item) => acc + item.downloads, 0);
    const totalViews = uploads.reduce((acc, item) => acc + item.views, 0);
    
    const reviews = await prisma.resourceReview.findMany({
      where: { resource: { authorId: userId } }
    });
    const avgRating = reviews.length > 0 
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length 
      : 0;

    // Fetch favorites
    const favorites = await prisma.resourceLike.findMany({
      where: { userId },
      include: { resource: true }
    });

    return NextResponse.json({
      uploads,
      favorites: favorites.map(f => f.resource),
      stats: {
        totalDownloads,
        totalViews,
        avgRating,
        uploadCount: uploads.length
      }
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
