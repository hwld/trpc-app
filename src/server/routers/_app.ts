import { router } from "../trpc/idnex";
import { requireLoggedInProcedure } from "../trpc/procedures";
import { meRoute } from "./me";
import { themesRoute } from "./themes";

export const appRouter = router({
  me: meRoute,
  themes: themesRoute,
  session: requireLoggedInProcedure.query(async ({ ctx }) => {
    return ctx.session;
  }),
});

export type AppRouter = typeof appRouter;
