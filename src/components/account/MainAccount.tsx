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
            <SmProfile id={session?.user.id || ""} />
            {children}
          </div>
        </LeftContent>
        <RightContent>
          <Profile id={session?.user.id || ""} />
        </RightContent>
      </Content>
    </Layout>
  );
}
