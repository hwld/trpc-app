import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { db } from "../prisma";
import { router } from "../trpc/idnex";
import { requireLoggedInProcedure } from "../trpc/procedures";

export const githubRoute = router({
  createRepo: requireLoggedInProcedure
    .input(z.object({ repoName: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // access-tokenを取得する
      const account = await db.account.findFirst({
        where: { userId: ctx.loggedInUser.id },
      });
      if (!account) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const token = account.access_token;

      const createRepoResult = await fetch(
        "https://api.github.com/user/repos",
        {
          method: "POST",
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: input.repoName }),
        }
      );
      const status = createRepoResult.status;

      if (status !== 201) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const json = await createRepoResult.json();
      return json.html_url;
    }),
});
