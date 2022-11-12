import { isLoggedIn } from "./middlewares";
import { procedure } from "./trpc";

export const requireLoggedInProcedure = procedure.use(isLoggedIn);
