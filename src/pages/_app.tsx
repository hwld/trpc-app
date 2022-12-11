import { AppLayout } from "@/client/components/AppLayout";
import { theme } from "@/client/styles/theme";
import { superjson } from "@/server/lib/superjson";
import { QueryClientPageProps } from "@/server/lib/withQueryClientGetServerSideProps";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { Noto_Sans_JP } from "@next/font/google";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useState } from "react";

export const noto = Noto_Sans_JP({
  weight: "500",
  subsets: ["japanese"],
});

function App({ Component, pageProps }: AppProps<QueryClientPageProps>) {
  const { stringifiedDehydratedState, ...props } = pageProps;

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: false, refetchOnWindowFocus: false },
        },
      })
  );

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
        <Hydrate state={superjson.parse(stringifiedDehydratedState || "{}")}>
          <MantineProvider withNormalizeCSS withGlobalStyles theme={theme}>
            <NotificationsProvider position="bottom-center">
              <AppLayout>
                <Component {...props} />
              </AppLayout>
            </NotificationsProvider>
          </MantineProvider>
        </Hydrate>
      </QueryClientProvider>
    </>
  );
}

export default App;
