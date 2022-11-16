import { DehydratedState } from "@tanstack/react-query";
import { GetServerSideProps } from "next";

export type GetServerSidePropsWithReactQuery<T = {}> = GetServerSideProps<
  {
    dehydratedState: DehydratedState;
  } & T
>;
