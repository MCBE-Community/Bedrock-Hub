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
    
    // Server specific fields
    const serverIp = formData.get("serverIp") as string;
    const serverPort = formData.get("serverPort") as string;
    const youtubeLink = formData.get("youtubeLink") as string;
    const trailerVideo = formData.get("trailerVideo") as string;
    
    // Community specific fields
    const discordLink = formData.get("discordLink") as string;

    const file = formData.get("file") as File | null;
    const thumbnail = formData.get("thumbnail") as File | null;
    const images = formData.getAll("images") as File[];

    if (!title || !description || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const isMetadataOnly = category === "Server" || category === "Community";
    if (!file && !isMetadataOnly) {
      return NextResponse.json({ error: "Missing file upload" }, { status: 400 });
    }

    // Create upload directories
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    const filesDir = path.join(uploadsDir, "files");
    const imagesDir = path.join(uploadsDir, "images");
    await mkdir(filesDir, { recursive: true });
    await mkdir(imagesDir, { recursive: true });

    const timestamp = Date.now();
    let thumbnailPath = "";

    // Save main thumbnail
    if (thumbnail && thumbnail.size > 0) {
      const thumbBuffer = Buffer.from(await thumbnail.arrayBuffer());
      const safeThumbName = thumbnail.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const thumbKey = `${timestamp}_thumb_${safeThumbName}`;
      const thumbPath = path.join(imagesDir, thumbKey);
      await writeFile(thumbPath, thumbBuffer);
      thumbnailPath = `/uploads/images/${thumbKey}`;
    }

    // Save gallery images
    const galleryPaths: string[] = [];
    for (let i = 0; i < Math.min(images.length, 5); i++) {
      const img = images[i];
      if (img.size > 0) {
        const imgBuffer = Buffer.from(await img.arrayBuffer());
        const safeImgName = img.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const imgKey = `${timestamp}_gallery_${i}_${safeImgName}`;
        const imgPath = path.join(imagesDir, imgKey);
        await writeFile(imgPath, imgBuffer);
        galleryPaths.push(`/uploads/images/${imgKey}`);
      }
    }

    const userId = (session.user as any).id;

    if (category === "Server") {
      const server = await prisma.server.create({
        data: {
          name: title,
          ip: serverIp,
          port: Number(serverPort) || 19132,
          description,
          thumbnail: thumbnailPath,
          discordLink: discordLink || null,
          youtubeLink: youtubeLink || null,
          trailerVideo: trailerVideo || null,
          screenshots: galleryPaths.join(","),
          status: "PENDING",
        },
      });
      return NextResponse.json({ success: true, server });
    }

    if (category === "Community") {
      const community = await prisma.community.create({
        data: {
          name: title,
          discordLink,
          description,
          thumbnail: thumbnailPath,
          status: "PENDING",
        },
      });
      return NextResponse.json({ success: true, community });
    }

    // Handle Resources (Addon, TexturePack, Map, etc.)
    let fileUrl = "";
    let fileName = "";
    let fileSize = 0;

    if (file && file.size > 0) {
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const fileKey = `${timestamp}_${safeFileName}`;
      const filePath = path.join(filesDir, fileKey);
      await writeFile(filePath, fileBuffer);
      fileUrl = `/uploads/files/${fileKey}`;
      fileName = file.name;
      fileSize = file.size;
    }

    const resource = await prisma.resource.create({
      data: {
        title,
        description,
        category,
        resolution: resolution || null,
        tags: tags || null,
        fileUrl,
        fileName,
        fileSize,
        thumbnail: thumbnailPath,
        thumbnails: galleryPaths.join(","),
        authorId: userId,
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, resource });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
