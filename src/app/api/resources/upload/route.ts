import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const resolution = formData.get("resolution") as string;
    const tags = formData.get("tags") as string;
    const file = formData.get("file") as File | null;
    const images = formData.getAll("images") as File[];

    if (!title || !description || !category || !file) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create upload directories
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    const filesDir = path.join(uploadsDir, "files");
    const imagesDir = path.join(uploadsDir, "images");
    await mkdir(filesDir, { recursive: true });
    await mkdir(imagesDir, { recursive: true });

    // Save the main file
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const fileKey = `${timestamp}_${safeFileName}`;
    const filePath = path.join(filesDir, fileKey);
    await writeFile(filePath, fileBuffer);

    // Save thumbnail images
    const thumbnailPaths: string[] = [];
    for (let i = 0; i < Math.min(images.length, 5); i++) {
      const img = images[i];
      if (img.size > 0) {
        const imgBuffer = Buffer.from(await img.arrayBuffer());
        const safeImgName = img.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const imgKey = `${timestamp}_${i}_${safeImgName}`;
        const imgPath = path.join(imagesDir, imgKey);
        await writeFile(imgPath, imgBuffer);
        thumbnailPaths.push(`/uploads/images/${imgKey}`);
      }
    }

    // Save to database
    const userId = (session.user as any).id;
    const resource = await prisma.resource.create({
      data: {
        title,
        description,
        category,
        resolution: resolution || null,
        tags: tags || null,
        fileUrl: `/uploads/files/${fileKey}`,
        fileName: file.name,
        fileSize: file.size,
        thumbnails: thumbnailPaths.join(","),
        authorId: userId,
      },
    });

    return NextResponse.json({ success: true, resource });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
