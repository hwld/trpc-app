import { initTRPC } from "@trpc/server";
import { superjson } from "../lib/superjson";
import { Context } from "./contexts";

const t = initTRPC.context<Context>().create({ transformer: superjson });
export const router = t.router;
export const procedure = t.procedure;
export const middleware = t.middleware;
