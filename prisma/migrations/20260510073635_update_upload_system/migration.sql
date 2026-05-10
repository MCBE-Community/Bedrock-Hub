-- AlterTable
ALTER TABLE "Resource" ADD COLUMN "thumbnail" TEXT;

-- AlterTable
ALTER TABLE "Server" ADD COLUMN "discordLink" TEXT;
ALTER TABLE "Server" ADD COLUMN "screenshots" TEXT;
ALTER TABLE "Server" ADD COLUMN "trailerVideo" TEXT;
ALTER TABLE "Server" ADD COLUMN "youtubeLink" TEXT;
