import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const tags = [
    "JavaScript",
    "HTML",
    "CSS",
    "TypeScript",
    "React",
    "Vue.js",
    "ANgular",
    "Svelte",
    "Next.js",
    "Nuxt.js",
    "PHP",
    "Laravel",
    "GO",
    "Ruby",
    "Ruby on Rails",
    "Python",
    "Django",
    "Flask",
    "Java",
    "Kotlin",
    "Spring Boot",
    "Webアプリ",
    "Swift",
    "Dart",
    "Flatter",
    "React Native",
    "スマホアプリ",
    "C#",
    "デスクトップアプリ",
    "C",
    "C++",
    "Rust",
  ];

  const promises = tags.map((tag) => {
    return prisma.appThemeTag.create({ data: { name: tag } });
  });
  prisma.$transaction(promises);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
