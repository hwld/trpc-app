import { GetServerSideProps } from "next";

export type GetServerSidePropsWithReactQuery<T = {}> = GetServerSideProps<
  {
    dehydratedState: string;
  } & T
>;
