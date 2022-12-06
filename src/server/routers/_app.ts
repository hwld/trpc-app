import { router } from "../trpc/idnex";
import { requireLoggedInProcedure } from "../trpc/procedures";
import { githubRoute } from "./github";
import { meRoute } from "./me";
import { themesRoute } from "./themes";

export const appRouter = router({
  me: meRoute,
  themes: themesRoute,
  session: requireLoggedInProcedure.query(async ({ ctx }) => {
    return ctx.session;
  }),
  github: githubRoute,
});

export type AppRouter = typeof appRouter;

// curl \
//   -X POST \
//   -H "Accept: application/vnd.github+json" \
//   -H "Authorization: Bearer <YOUR-TOKEN>" \
//   https://api.github.com/user/repos \
//   -d '{"name":"Hello-World","description":"This is your first repo!","homepage":"https://github.com","private":false,"is_template":true}'
