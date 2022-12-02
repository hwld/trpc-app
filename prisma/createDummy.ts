import { faker } from "@faker-js/faker/locale/ja";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ダミーユーザーを作ってお題を投稿し、そこに参加する
async function main() {
  await prisma.$transaction(async (tx) => {
    const userIds: string[] = [];
    const themeIds: string[] = [];

    for (let i = 0; i < 50; i++) {
      //ユーザーを作成
      const user = await tx.user.create({
        data: { name: faker.name.fullName() },
      });
      //お代を作成
      const theme = await tx.appTheme.create({
        data: {
          title: faker.lorem.sentence(),
          description: faker.lorem.lines(10),
          userId: user.id,
        },
      });

      userIds.push(user.id);
      themeIds.push(theme.id);
    }

    // 50人全員一つのお題に参加
    for (let i = 0; i < userIds.length; i++) {
      await tx.appThemeDeveloper.create({
        data: { themeId: themeIds[0], userId: userIds[i] },
      });
    }
  });
}

main();
