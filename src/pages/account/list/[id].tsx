import { type NextPage } from "next";
import Link from "next/link";

import { useRouter } from "next/router";
import Lists from "~/data/lists";
import MainAccount from "../../../components/account/MainAccount";

const Stories: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const list = Lists.find((list) => list.id === id);
  return (
    <MainAccount>
      <h1 className="text-3xl font-medium text-textNavbar md:mt-5 md:text-5xl">
        {list?.name}
      </h1>
      <div className="flex h-[calc(100vh-400px)] w-full flex-col gap-5 overflow-y-scroll scrollbar-hide">
        {list?.storiesList?.map((story) => {
          return (
            <div
              key={story.id}
              className="flex flex-col gap-5 rounded-lg bg-slate-100 px-2 py-5"
            >
              <Link
                href={`/account/story/${story.id}`}
                className="text-xl font-medium text-textNavbar  hover:underline md:text-2xl"
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
