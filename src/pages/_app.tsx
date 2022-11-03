import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { trpc } from "../client/trpc";

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <Head>
        <title>tRPC App</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <SessionProvider session={session}>
        <MantineProvider withGlobalStyles withNormalizeCSS theme={{}}>
          <NotificationsProvider position="bottom-center">
            <Component {...pageProps} />
          </NotificationsProvider>
        </MantineProvider>
      </SessionProvider>
    </>
  );
}

export default trpc.withTRPC(App);
