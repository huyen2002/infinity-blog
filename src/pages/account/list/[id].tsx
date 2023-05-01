import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import Link from "next/link";

import { Post, ReadList, User } from "@prisma/client";
import { prisma } from "~/server/db";
import MainAccount from "../../../components/account/MainAccount";

const Stories = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  // const router = useRouter();
  // const { id } = router.query;
  // const list = Lists.find((list) => list.id === id);
  const stories = props.stories;
  return (
    <MainAccount>
      <h1 className="text-xl font-medium text-textNavbar md:mt-5 md:text-3xl">
        {props.readlist.name}
      </h1>
      <div className="flex h-[calc(100vh-400px)] w-full flex-col gap-5 overflow-y-scroll scrollbar-hide">
        {stories &&
          stories?.map((story) => {
            return (
              <div
                key={story.id}
                className="flex flex-col gap-5 rounded-lg bg-slate-100 px-2 py-5"
              >
                <Link
                  href={`/post/${story.id}`}
                  className="text-lg font-medium text-textNavbar  hover:underline md:text-xl"
                >
                  {story.title}
                </Link>
                <div className="flex justify-between">
                  <p className="text-sm text-textNavbar md:text-base">
                    {story.author.name}
                  </p>
                  <button className="text-sm md:text-base">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-6 w-6 text-textBio hover:text-textNavbar"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </MainAccount>
  );
};
export default Stories;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.query as { id: string };
  const readlist = await prisma.readList.findUnique({
    where: {
      id: id,
    },
  });
  const stories = await prisma.post.findMany({
    where: {
      postReadList: {
        some: {
          readListId: id,
        },
      },
    },
    include: {
      author: true,
    },
  });
  return {
    props: {
      readlist: JSON.parse(JSON.stringify(readlist)) as ReadList,
      stories: JSON.parse(JSON.stringify(stories)) as (Post & {
        author: User;
      })[],
    },
  };
}
