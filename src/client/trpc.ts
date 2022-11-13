import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { inferRouterInputs } from "@trpc/server";
import { AppRouter } from "../server/routers/_app";

// TODO
function getBaseUrl() {
  return "http://localhost:3000";
}

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [httpBatchLink({ url: `${getBaseUrl()}/api/trpc` })],
});

export type RouterInput = inferRouterInputs<AppRouter>;
