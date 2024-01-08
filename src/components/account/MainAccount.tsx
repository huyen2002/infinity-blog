import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import Content from "../Content";
import Layout from "../Layout";
import LeftContent from "../LeftContent";
import Navbar from "../Navbar";
import RightContent from "../RightContent";
import Options from "./Options";
import Profile, { SmProfile } from "./Profile";

export default function MainAccount({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  return (
    <Layout>
      <Navbar />
      <Content>
        <LeftContent>
          <Options />
          <div className="flex flex-col gap-10 border-t">
            <SmProfile user={session?.user as User} />
            {children}
          </div>
        </LeftContent>
        <RightContent>
          <Profile user={session?.user as User} />
        </RightContent>
      </Content>
    </Layout>
  );
}
