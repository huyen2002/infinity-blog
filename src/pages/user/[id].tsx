import { type NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import Content from "~/components/Content";
import Layout from "~/components/Layout";
import LeftContent from "~/components/LeftContent";
import Navbar from "~/components/Navbar";
import RightContent from "~/components/RightContent";
import Profile from "~/components/account/Profile";
import { api } from "~/utils/api";

const User: NextPage = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const { data: user } = api.user.getOneWhereId.useQuery(id);
  const posts = user?.post;
  return (
    <Layout>
      <Navbar />
      <Content>
        <LeftContent>
          <h1 className="text-xl font-medium text-textNavbar md:mt-5 md:text-3xl">
            Stories
          </h1>
          <div className="flex h-[calc(100vh-400px)] w-full flex-col gap-5 overflow-y-scroll scrollbar-hide">
            {posts &&
              posts.map((post) => {
                return (
                  <div
                    key={post.id}
                    className="flex flex-col gap-5 rounded-lg bg-slate-100 px-2 py-5"
                  >
                    <Link
                      href={`/post/${post.id}`}
                      className="text-lg font-medium text-textNavbar  hover:underline md:text-xl"
                    >
                      {post.title}
                    </Link>
                    <div className="flex justify-between">
                      <span className="text-sm text-textBio md:text-base">
                        {`Published at ${post.updatedAt.toISOString()}`}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </LeftContent>
        <RightContent>
          <Profile id={id} />
        </RightContent>
      </Content>
    </Layout>
  );
};
export default User;
