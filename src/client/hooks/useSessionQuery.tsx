import { useQuery } from "@tanstack/react-query";
import { trpc } from "../trpc";

export const sessionQueryKey = ["session"];

export const useSessionQuery = () => {
  const { data: session, ...others } = useQuery(sessionQueryKey, async () => {
    return trpc.session.query();
  });

  return { session, ...others };
};
