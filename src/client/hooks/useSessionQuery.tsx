import { useQuery } from "@tanstack/react-query";
import { trpc } from "../trpc";

export const useSessionQuery = () => {
  // TODO: queryKeyを外に出す
  const { data: session, ...others } = useQuery(["session"], async () => {
    return trpc.session.query();
  });

  return { session, ...others };
};
