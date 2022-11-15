import { router } from "../trpc/idnex";
import { meRoute } from "./me";
import { themesRoute } from "./themes";

export const appRouter = router({
  me: meRoute,
  themes: themesRoute,
});

export type AppRouter = typeof appRouter;
