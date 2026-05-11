import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = (session.user as any).id;
    const { message } = await req.json();

    // Check if application already exists
    const existing = await prisma.verificationApplication.findFirst({
      where: { userId, status: "PENDING" }
    });

    if (existing) {
      return NextResponse.json({ error: "You already have a pending application." }, { status: 400 });
    }

    const application = await prisma.verificationApplication.create({
      data: {
        userId,
        message,
        status: "PENDING"
      }
    });

    return NextResponse.json(application);
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
  }
}
