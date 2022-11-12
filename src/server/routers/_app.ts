import { router } from "../trpc";
import { meRoute } from "./me";

export const appRouter = router({
  me: meRoute,
});

export type AppRouter = typeof appRouter;
