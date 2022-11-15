import { procedure } from "./idnex";
import { isLoggedIn } from "./middlewares";

export const requireLoggedInProcedure = procedure.use(isLoggedIn);
