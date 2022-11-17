import { AppShell } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { ReactNode } from "react";
import { trpc } from "../trpc";
import { AppHeader } from "./AppHeader";
import { AppNavbar } from "./AppNavbar";

type Props = { children: ReactNode };
export const AppLayout: React.FC<Props> = ({ children }) => {
  const { data: session } = useQuery(["session"], async () => {
    return trpc.session.query();
  });

  return (
    <AppShell
      navbar={<AppNavbar user={session?.user} />}
      header={<AppHeader />}
    >
      {children}
    </AppShell>
  );
};
