import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ResourceClient from "./ResourceClient";

export default async function ResourcePage({ params }: { params: { slug: string } }) {
  const resource = await prisma.resource.findUnique({
    where: { id: params.slug },
    include: {
      author: {
        select: { name: true, image: true }
      }
    }
  });

  if (!resource) {
    notFound();
  }

  return <ResourceClient resource={resource} />;
}
