import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id, type, action } = await req.json(); // action: "APPROVE" or "REJECT"
    const status = action === "APPROVE" ? "APPROVED" : "REJECTED";

    if (type === "resource") {
      await prisma.resource.update({ where: { id }, data: { status } });
    } else if (type === "server") {
      await prisma.server.update({ where: { id }, data: { status } });
    } else if (type === "community") {
      await prisma.community.update({ where: { id }, data: { status } });
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin action error:", error);
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
