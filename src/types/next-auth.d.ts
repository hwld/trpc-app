import "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    // [...nextauth].tsで、userのidをsessionに含めるようにしている。
    userId: string;
  }
}
