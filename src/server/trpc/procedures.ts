import { procedure } from "./idnex";
import { isLoggedIn } from "./middlewares";

export const publicProcedure = procedure;
export const requireLoggedInProcedure = procedure.use(isLoggedIn);
