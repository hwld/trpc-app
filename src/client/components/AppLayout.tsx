import { AppShell } from "@mantine/core";
import { ReactNode } from "react";
import { useSessionQuery } from "../hooks/useSessionQuery";
import { AppHeader } from "./AppHeader";
import { AppNavbar } from "./AppNavbar";

type Props = { children: ReactNode };
export const AppLayout: React.FC<Props> = ({ children }) => {
  const { session } = useSessionQuery();

  return (
    <AppShell
      navbar={<AppNavbar user={session?.user} />}
      header={<AppHeader />}
    >
      {children}
    </AppShell>
  );
};
