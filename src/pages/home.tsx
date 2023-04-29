import { type NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import Content from "../components/Content";
import Layout from "../components/Layout";
import LeftContent from "../components/LeftContent";
import Navbar from "../components/Navbar";
import RightContent from "../components/RightContent";

const Home: NextPage = () => {
  const { data: topics } = api.topic.getAll.useQuery();

  const [active, setActive] = useState<string>(
    topics !== undefined ? topics[0].id : ""
  );
  const handleActive = (e: React.MouseEvent<HTMLElement>) => {
    setActive(e.target.id);
    // console.log(active);
  };
  const { data: posts } = api.post.getAllWhereTopicId.useQuery(active);

  useEffect(() => {
    console.log(active);
  }, [active]);

  return (
    <Layout>
      <Navbar />
      <Content>
        <LeftContent>
          <div className="flex gap-5">
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
          {posts &&
            posts.map((post) => {
              return (
                <div key={post.id}>
                  <Link href={`/account/${post.authorId}`}>
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
                        <p className=" text-sm font-normal md:text-base">{`${getWordStr(
                          post.description || ""
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
        </LeftContent>

        <RightContent>
          <div className="flex flex-col items-center gap-10">
            <h3>Recommended Topics</h3>
            <div className="flex gap-5"></div>
          </div>
        </RightContent>
      </Content>
    </Layout>
  );
};
export default Home;

function getWordStr(str: string) {
  // 50 words
  return str.split(/\s+/).slice(0, 50).join(" ");
}
