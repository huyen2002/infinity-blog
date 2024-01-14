import { type Post, type Topic, type User } from "@prisma/client"
import { type InferGetStaticPropsType } from "next"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import LoadingScreen from "~/components/LoadingScreen"
import Pagination from "~/components/Pagination"
import { defaultParams } from "~/constants/QueryParams"
import { prisma } from "~/server/db"
import { api } from "~/utils/api"
import Content from "../components/Content"
import Layout from "../components/Layout"
import LeftContent from "../components/LeftContent"
import Navbar from "../components/Navbar"
import RightContent from "../components/RightContent"

const Home = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  // const { data: topics } = api.topic.getAll.useQuery();

  const topics: Topic[] | undefined = props.topics;
  const [active, setActive] = useState<string>(
    topics && topics[0] ? topics[0].id : ""
  );
  const handleActive = (e: React.MouseEvent<HTMLButtonElement>) => {
    setActive((e.target as HTMLInputElement).id);
  };

  const [page, setPage] = useState<number>(defaultParams.page);

  const { data, isFetching } = api.post.getAllWhereTopicId.useQuery({
    topicId: active,
    params: {
      page: page,
      size: defaultParams.size,
    },
  });
  const posts: (Post & { author: User })[] = data
    ? (data.data as (Post & { author: User })[])
    : [];

  useEffect(() => {
    setPage(defaultParams.page);
  }, [active]);

  const handleSetPage = (page: number) => {
    setPage(page);
  };

  return (
    <div>
      <Layout>
        <Navbar />
        <Content>
          <LeftContent>
            {!isFetching ? (
              <div>
                <div className="mb-5 flex gap-8">
                  {topics &&
                    topics.map((topic) => {
                      return (
                        <button
                          key={topic.id}
                          className={`${
                            active === topic.id ? "bg-blue-100" : "bg-slate-100"
                          } rounded-md px-3 py-2 text-textBio hover:bg-slate-200`}
                          id={topic.id}
                          onClick={handleActive}
                        >
                          {topic.name}
                        </button>
                      );
                    })}
                </div>
                <div className="mb-5">
                  {posts &&
                    posts.map((post) => {
                      return (
                        <div key={post.id}>
                          <Link href={`/user/${post.authorId}`}>
                            <div className="flex items-center gap-5 ">
                              <div className="rounded-full ">
                                <Image
                                  src={post?.author.image || ""}
                                  alt="author"
                                  width={40}
                                  height={40}
                                  className="h-12 w-12 rounded-full object-cover"
                                />
                              </div>

                              <div className="flex flex-col">
                                <span className="text-sm font-medium md:text-base">
                                  {post.author.name}
                                </span>
                                <span className="text-xs text-textBio md:text-sm">
                                  {post.updatedAt.toISOString()}
                                </span>
                              </div>
                            </div>
                          </Link>
                          <Link href={`/post/${post.id}`}>
                            <div className="flex items-center gap-5">
                              <div className="my-4 flex flex-col gap-5">
                                <h1 className="text-lg font-semibold text-title hover:text-titleHover md:text-xl">
                                  {post.title}
                                </h1>
                                <p className="text-sm font-normal text-textBio md:text-base">{`${getWordStr(
                                  {
                                    str: post.description || "",
                                    num: 50,
                                  }
                                )}...`}</p>
                              </div>
                              <div>
                                <Image
                                  src={post.feature || ""}
                                  width={400}
                                  height={400}
                                  alt="post"
                                  className="hidden rounded-sm object-cover lg:block"
                                />
                              </div>
                            </div>
                          </Link>
                        </div>
                      );
                    })}
                </div>
                <Pagination
                  total={data ? (data.total as number) : 0}
                  current={page}
                  pageSize={defaultParams.size}
                  setPage={(page: number) => handleSetPage(page)}
                />
              </div>
            ) : (
              <LoadingScreen />
            )}
          </LeftContent>

          <RightContent>
            <div className="flex flex-col gap-8">
              <h3 className="text-base font-bold text-textNavbar md:text-xl">
                New updates
              </h3>
              <div className="flex flex-col gap-5">
                {props.posts &&
                  props.posts.length > 0 &&
                  props.posts.map((post) => {
                    return (
                      <div key={post.id}>
                        <Link href={`/post/${post.id}`}>
                          <h1 className="text-sm font-semibold text-title hover:text-titleHover md:text-lg">
                            {post.title}
                          </h1>
                          <p className="text-xs font-normal text-textBio md:text-sm">{`${getWordStr(
                            {
                              str: post.description || "",
                              num: 10,
                            }
                          )}...`}</p>
                        </Link>
                      </div>
                    );
                  })}
              </div>
            </div>
          </RightContent>
        </Content>
      </Layout>
    </div>
  );
};
export default Home;

function getWordStr({ str, num }: { str: string; num: number }) {
  // 50 words
  return str.split(/\s+/).slice(0, num).join(" ");
}
export async function getStaticProps() {
  const topics: Topic[] | undefined = await prisma.topic.findMany();
  const posts: (Post & {
    author: User;
  })[] = await prisma.post.findMany({
    where: {
      published: true,
    },
    include: {
      author: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: 5,
  });
  return {
    props: {
      topics,
      posts: JSON.parse(JSON.stringify(posts)) as (Post & {
        author: User;
      })[],
    },
  };
}
