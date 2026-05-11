import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const resourceId = params.id;
    const { rating, content } = await req.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
    }

    const review = await prisma.resourceReview.upsert({
      where: {
        resourceId_userId: { resourceId, userId }
      },
      update: {
        rating,
        content,
        createdAt: new Date()
      },
      create: {
        resourceId,
        userId,
        rating,
        content
      }
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("Review error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const reviews = await prisma.resourceReview.findMany({
      where: { resourceId: params.id },
      include: { user: { select: { name: true, image: true } } },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}
