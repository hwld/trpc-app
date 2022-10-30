import { httpBatchLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { AppRouter } from "../server/routers/_app";

// TODO
function getBaseUrl() {
  return "http://localhost:3000";
}

export const trpc = createTRPCNext<AppRouter>({
  config({ ctx }) {
    return {
      links: [httpBatchLink({ url: `${getBaseUrl()}/api/trpc` })],
    };
  },
  ssr: true,
});
