import { Menu, Transition } from "@headlessui/react";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Fragment } from "react";
import { api } from "~/utils/api";
import MainAccount from "../../components/account/MainAccount";

const Stories: NextPage = () => {
  const session = useSession();

  const { data } = api.post.getPostByUserId.useQuery(
    session.data?.user.id as string
  );
  const stories = data?.filter((post) => post.published);
  return (
    <MainAccount>
      <h1 className="text-xl font-medium text-textNavbar md:mt-5 md:text-3xl">
        Stories
      </h1>
      <div className="flex h-[calc(100vh-400px)] w-full flex-col gap-5 overflow-y-scroll scrollbar-hide">
        {stories &&
          stories.map((story) => {
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
                  <span className="text-sm text-textBio md:text-base">
                    {`Published at ${story.updatedAt.toISOString()}`}
                  </span>
                  <MoreOptions />
                </div>
              </div>
            );
          })}
      </div>
    </MainAccount>
  );
};
export default Stories;

function MoreOptions() {
  return (
    <div className="top-16 w-28 text-right">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-28 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 ">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? "bg-slate-100" : "text-gray-900"
                    } group flex w-full items-center rounded-md px-2 py-2 text-base font-medium`}
                  >
                    Revoke
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? "bg-slate-100" : "text-gray-900"
                    } group flex w-full items-center rounded-md px-2 py-2 text-base font-medium text-red-500`}
                  >
                    Delete
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
