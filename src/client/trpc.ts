import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { inferRouterInputs } from "@trpc/server";
import { AppRouter } from "../server/routers/_app";

// TODO
function getBaseUrl() {
  if (process.env.NODE_ENV === "production") {
    return `https://${process.env.NEXT_PUBLIC_URL}`;
  } else {
    return "http://localhost:3000";
  }
}

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [httpBatchLink({ url: `${getBaseUrl()}/api/trpc` })],
});

export type RouterInput = inferRouterInputs<AppRouter>;
