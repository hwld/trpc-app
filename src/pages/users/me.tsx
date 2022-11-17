import { ProfileUpdatePage } from "@/client/components/ProfileUpdatePage";
import { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOption } from "../api/auth/[...nextauth]";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await unstable_getServerSession(req, res, authOption);

  if (!session?.user) {
    return { redirect: { destination: "/", permanent: false } };
  }

  return { props: {} };
};

const Me: NextPage = () => {
  return <ProfileUpdatePage />;
};
export default Me;
