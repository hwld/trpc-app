import { ProfileUpdatePage } from "@/client/components/ProfileUpdatePage";
import { withQueryClientGetServerSideProps } from "@/server/lib/withQueryClientGetServerSideProps";
import { NextPage } from "next";

export const getServerSideProps = withQueryClientGetServerSideProps(
  async ({ session }) => {
    if (!session?.user) {
      if (!session?.user) {
        return { redirect: { destination: "/", permanent: false } };
      }
    }
  }
);

const Me: NextPage = () => {
  return <ProfileUpdatePage />;
};
export default Me;
