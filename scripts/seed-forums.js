const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: "General Discussion", description: "Talk about anything related to Bedrock Edition." },
    { name: "Showcase", description: "Show off your latest creations." },
    { name: "Help & Support", description: "Get help with technical issues or gameplay." },
    { name: "Bug Reports", description: "Report bugs in resources or the platform." },
    { name: "Feature Requests", description: "Suggest new features for Bedrock Hub." },
  ];

  for (const cat of categories) {
    await prisma.forumCategory.upsert({
      where: { id: cat.name.toLowerCase().replace(/ /g, '-') },
      update: {},
      create: {
        id: cat.name.toLowerCase().replace(/ /g, '-') ,
        name: cat.name,
        description: cat.description,
      }
    });
  }
  console.log("Forum categories seeded!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
