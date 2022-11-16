import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { Noto_Sans_JP } from "@next/font/google";
import {
  DehydratedState,
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useState } from "react";

const noto = Noto_Sans_JP({
  weight: "500",
  subsets: ["japanese"],
});

function App({
  Component,
  pageProps,
}: AppProps<{ session: Session; dehydratedState: DehydratedState }>) {
  const { session, dehydratedState, ...props } = pageProps;
  const [queryClient] = useState(() => new QueryClient());

  return (
    <>
      <Head>
        <title>tRPC App</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <QueryClientProvider client={queryClient}>
        <Hydrate state={dehydratedState}>
          <SessionProvider session={session}>
            <MantineProvider
              withNormalizeCSS
              withGlobalStyles
              theme={{
                fontFamily: `${noto.style.fontFamily}, sans-serif;`,
                headings: {
                  fontFamily: `${noto.style.fontFamily}, sans-serif;`,
                },
              }}
            >
              <NotificationsProvider position="bottom-center">
                <Component {...props} />
              </NotificationsProvider>
            </MantineProvider>
          </SessionProvider>
        </Hydrate>
      </QueryClientProvider>
    </>
  );
}

export default App;
