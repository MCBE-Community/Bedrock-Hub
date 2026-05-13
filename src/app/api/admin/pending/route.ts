import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const [resources, servers, communities] = await Promise.all([
      prisma.resource.findMany({
        where: { status: "PENDING" },
        include: { author: { select: { name: true, email: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.server.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "desc" },
      }),
      prisma.community.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json({
      resources,
      servers,
      communities,
    });
  } catch (error) {
    console.error("Admin fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch pending content" }, { status: 500 });
  }
}
