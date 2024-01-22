import type { Post, User } from "@prisma/client";
import { type NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import Content from "~/components/Content";
import Layout from "~/components/Layout";
import LeftContent from "~/components/LeftContent";
import LoadingScreen from "~/components/LoadingScreen";
import Navbar from "~/components/Navbar";
import Pagination from "~/components/Pagination";
import RightContent from "~/components/RightContent";
import Profile from "~/components/account/Profile";
import { defaultParams } from "~/constants/QueryParams";
import { api } from "~/utils/api";
import { DateTimeUtils } from "~/utils/dateTime";

const User: NextPage = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const { data: user, isFetching } = api.user.getOneWhereId.useQuery(id);
  const [page, setPage] = useState<number>(defaultParams.page);
  const { data, isFetching: fetching } = api.post.getPostByUserId.useQuery(
    {
      id: id,
      params: {
        page: page,
        size: defaultParams.size,
      },
    },
    {
      refetchOnWindowFocus: false,
    }
  );
  const posts: (Post & {
    author: User;
  })[] = data ? data.data : [];
  const handleSetPage = (page: number) => {
    setPage(page);
  };

  return (
    <Layout>
      <Navbar />
      {!(isFetching && fetching) ? (
        <Content>
          <LeftContent>
            <h1 className="text-xl font-medium text-textNavbar md:text-3xl">
              Stories
            </h1>
            <div>
              <div className="mb-5 flex w-full flex-col gap-5">
                {posts &&
                  posts.map((post) => {
                    return (
                      <div
                        key={post.id}
                        className="flex flex-col gap-5 rounded-lg bg-slate-100 px-2 py-5"
                      >
                        <Link
                          href={`/post/${post.id}`}
                          className="text-lg font-medium text-textNavbar hover:underline md:text-xl"
                        >
                          {post.title}
                        </Link>
                        <div className="flex justify-between">
                          <span className="text-sm text-textBio md:text-base">
                            {`Published at ${DateTimeUtils.getFullDate(
                              post.updatedAt
                            )}`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
              <Pagination
                pageSize={defaultParams.size}
                current={page}
                total={posts?.length || 0}
                setPage={handleSetPage}
              />
            </div>
          </LeftContent>
          <RightContent>
            <Profile id={user?.id} />
          </RightContent>
        </Content>
      ) : (
        <LoadingScreen />
      )}
    </Layout>
  );
};
export default User;
