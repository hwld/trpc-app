import { UserDeletePage } from "@/client/components/UserDeletePage";
import { withQueryClientGetServerSideProps } from "@/server/lib/withQueryClientGetServerSideProps";
import { NextPage } from "next";

export const getServerSideProps = withQueryClientGetServerSideProps(
  async ({ session }) => {
    if (!session?.user) {
      return { redirect: { destination: "/", permanent: false } };
    }
  }
);

const DeleteMe: NextPage = () => {
  return <UserDeletePage />;
};

export default DeleteMe;
