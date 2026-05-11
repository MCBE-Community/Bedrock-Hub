import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const resourceId = params.id;
    const resource = await prisma.resource.findUnique({ where: { id: resourceId } });

    if (resource?.authorId !== (session.user as any).id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { version, changelog, fileUrl, fileName, fileSize } = await req.json();

    const newVersion = await prisma.resourceVersion.create({
      data: {
        resourceId,
        version,
        changelog,
        fileUrl,
        fileName,
        fileSize
      }
    });

    return NextResponse.json(newVersion);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create version" }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const versions = await prisma.resourceVersion.findMany({
    where: { resourceId: params.id },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(versions);
}
