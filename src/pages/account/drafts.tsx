import { Menu, Transition } from "@headlessui/react";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { api } from "~/utils/api";
import MainAccount from "../../components/account/MainAccount";

const Drafts: NextPage = () => {
  const session = useSession();
  const { data } = api.post.getPostByUserId.useQuery(
    session.data?.user.id as string
  );
  const drafts = data?.filter((post) => !post.published);
  const mutation = api.post.deleteDraft.useMutation();
  const handleDelete = (id: string) => {
    mutation.mutate(id);
    window.location.reload();
  };

  const router = useRouter();
  const handlePublish = async (id: string) => {
    await router
      .push({
        pathname: "/publish",
        query: { id: id },
      })
      .then(() => window.scrollTo(0, 0))
      .catch((err) => console.log(err));
  };
  return (
    <MainAccount>
      <h1 className="text-xl font-medium text-textNavbar md:mt-5 md:text-3xl">
        Drafts
      </h1>
      <div className="flex h-[calc(100vh-400px)] w-full flex-col gap-5 overflow-y-scroll scrollbar-hide">
        {drafts &&
          drafts.map((post) => {
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
                  <span className="font-xs text-sm text-textBio md:text-sm">
                    {`Update at ${post.updatedAt.toISOString()}`}
                  </span>
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
                                  onClick={() => handlePublish(post.id)}
                                  className={`${
                                    active ? "bg-slate-100" : "text-gray-900"
                                  } group flex w-full items-center rounded-md px-2 py-2 text-base font-medium`}
                                >
                                  Publish
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => handleDelete(post.id)}
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
                </div>
              </div>
            );
          })}
      </div>
    </MainAccount>
  );
};
export default Drafts;
