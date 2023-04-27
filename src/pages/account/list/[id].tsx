import { type NextPage } from "next";
import Link from "next/link";

import { useRouter } from "next/router";
import MainAccount from "../../../components/account/MainAccount";
import Posts from "../../../data/posts";

const Stories: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const list = Posts.find((post) => post.id === id);
  return (
    <MainAccount>
      <h1 className="text-textNavbar text-3xl font-medium md:mt-5 md:text-5xl">
        {list?.name}
      </h1>
      <div className="scrollbar-hide flex h-[calc(100vh-400px)] w-full flex-col gap-5 overflow-y-scroll">
        {list?.storiesList?.map((story) => {
          return (
            <div
              key={story.id}
              className="flex flex-col gap-5 rounded-lg bg-slate-100 px-2 py-5"
            >
              <Link
                href={`/account/story/${story.id}`}
                className="text-textNavbar text-xl font-medium  hover:underline md:text-2xl"
              >
                {story.title}
              </Link>
            </div>
          );
        })}
      </div>
    </MainAccount>
  );
};
export default Stories;
