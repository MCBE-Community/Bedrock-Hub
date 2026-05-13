import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resource = await prisma.resource.update({
      where: { id: params.id },
      data: { downloads: { increment: 1 } },
    });

    return NextResponse.json({ url: resource.fileUrl, fileName: resource.fileName });
  } catch (error) {
    return NextResponse.json({ error: "Resource not found" }, { status: 404 });
  }
}
