import { Dialog, Transition } from "@headlessui/react"
import {
  Post,
  type Follows,
  type PostReadList,
  type Reaction,
  type User,
} from "@prisma/client"
import parse from "html-react-parser"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next/types"
import { Fragment, useEffect, useRef, useState } from "react"
import LoadingScreen from "~/components/LoadingScreen"
import { prisma } from "~/server/db"
import { api } from "~/utils/api"
import Content from "../../components/Content"
import Layout from "../../components/Layout"
import Navbar from "../../components/Navbar"
import RightContent from "../../components/RightContent"

const Post = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  // const router = useRouter();
  // const { id } = router.query as { id: string };
  // const { data: post } = api.post.getOneWhereId.useQuery(id);
  const { data: readLists } = api.readlist.getAll.useQuery();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const utils = api.useContext();
  const readListsArr = readLists?.filter((item) =>
    item.posts.some((post) => post.postId === props.post.id)
  );
  // console.log(test);
  const readListIds: Array<string> | undefined = readListsArr?.map(
    (item) => item.id
  );

  // console.log(readLists);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<Array<string>>(
    readListIds ?? []
  );
  const mutationCreate = api.postReadlist.create.useMutation({
    onSuccess() {
      void utils.postReadlist.invalidate();
    },
  });
  const mutationDelete = api.postReadlist.delete.useMutation({
    onSuccess() {
      void utils.postReadlist.invalidate();
    },
  });
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (selectedCheckboxes.includes(value)) {
      setSelectedCheckboxes(
        selectedCheckboxes.filter((item) => item !== value) // remove item from array
      );
      mutationDelete.mutate({
        postId: props.post.id,
        readListId: value,
      });
    } else {
      mutationCreate.mutate({
        postId: props.post.id,
        readListId: value,
      });
      setSelectedCheckboxes([...selectedCheckboxes, value]);
    }
  };

  const [isReported, setIsReported] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  function closeModal() {
    setIsOpen(false);
  }
  function openModal() {
    setIsOpen(true);
  }

  const [nameReadlist, setNameReadlist] = useState("");

  const mutation = api.readlist.create.useMutation({
    onSuccess() {
      void utils.readlist.invalidate();
    },
  });
  const handleCreateNewReadlist = () => {
    mutation.mutate(nameReadlist);
    setNameReadlist("");
    setIsOpen(false);
  };

  const mutationFollow = api.follows.create.useMutation({
    onSuccess() {
      void utils.post.invalidate();
    },
  });
  const mutationUnFollow = api.follows.delete.useMutation({
    onSuccess() {
      void utils.post.invalidate();
    },
  });
  const { data: session } = useSession();

  const followings = props.post.author.followedBy.find(
    (item) => item.followerId === session?.user?.id
  );
  // console.log(followings);
  const [isFollowed, setIsFollowed] = useState<boolean>(
    followings ? true : false
  );
  useEffect(() => {
    setIsFollowed(followings ? true : false);
  }, [followings]);

  // console.log(isFollowed);
  const handleFollow = () => {
    // console.log(isFollowed);
    if (isFollowed === false) {
      mutationFollow.mutate(props.post.authorId);
      setIsFollowed(true);
    } else {
      mutationUnFollow.mutate(props.post.authorId);
      setIsFollowed(false);
    }
  };

  const postRef = useRef<HTMLDivElement>(null);
  const mutationHistory = api.post.addToHistory.useMutation({
    onSuccess() {
      console.log("history success");
    },
  });
  const handleScroll = () => {
    console.log("scroll");
    if (postRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = postRef.current;
      if (scrollTop + clientHeight >= (scrollHeight * 2) / 3) {
        console.log("reach bottom");
        mutationHistory.mutate(props.post.id);
      }
    }
  };
  return (
    <Layout>
      <Navbar />
      {props ? (
        <Content>
          <div
            ref={postRef}
            onScroll={handleScroll}
            className="flex h-screen flex-col overflow-y-scroll scrollbar-hide md:w-4/5"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4 ">
                <Image
                  src={props.post.author.image || ""}
                  alt="author"
                  width={40}
                  height={40}
                  className="h-12 w-12 rounded-full object-cover md:h-14 md:w-14"
                />
                <div className="flex flex-col gap-1">
                  <div className="flex gap-10">
                    <h1 className="text-base font-medium md:text-lg lg:text-xl">
                      {props.post.author.name}
                    </h1>
                    {props.post.authorId !== session?.user?.id && (
                      <button
                        onClick={handleFollow}
                        className="rounded-2xl bg-button px-2 py-2 text-sm text-white hover:bg-buttonHover md:hidden"
                      >
                        {isFollowed ? "Unfollow" : "Follow"}
                      </button>
                    )}
                  </div>

                  <span className="text-sm font-normal text-textBio lg:text-base">
                    {props.post.updatedAt.toString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-10 pl-2 pt-5 md:pl-0 md:pt-0">
                <div className="relative inline-block text-left">
                  <div>
                    <span className="rounded-md shadow-sm">
                      <button
                        type="button"
                        className=""
                        id="options-menu"
                        aria-haspopup="false"
                        aria-expanded={dropdownOpen}
                        onClick={handleDropdownToggle}
                      >
                        {selectedCheckboxes.length === 0 ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="#757575"
                            className="h-8 w-8"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="#757575"
                            className="h-8 w-8"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                    </span>
                  </div>
                  {dropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      {readLists &&
                        readLists.map((readlist) => (
                          <div
                            key={readlist.id}
                            className="flex items-center px-4 py-2 text-sm text-gray-700"
                          >
                            <input
                              type="checkbox"
                              className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                              value={readlist.id}
                              checked={selectedCheckboxes.includes(readlist.id)} // this is where we check if the item is in the array
                              onChange={handleCheckboxChange}
                            />
                            <span className="ml-2">{readlist.name}</span>
                          </div>
                        ))}

                      <button
                        onClick={openModal}
                        className="mt-4 w-full px-4 py-3 text-left text-sm font-medium text-button hover:text-buttonHover"
                      >
                        Create new readlist
                      </button>
                      <Transition appear show={isOpen} as={Fragment}>
                        <Dialog
                          as="div"
                          className="relative z-10"
                          onClose={closeModal}
                        >
                          <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <div className="fixed inset-0 bg-black bg-opacity-25" />
                          </Transition.Child>

                          <div className="fixed inset-0 overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center p-4 text-center">
                              <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                              >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                  <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900"
                                  >
                                    Create new readlist
                                  </Dialog.Title>
                                  <div className="mt-4">
                                    <input
                                      type="text"
                                      placeholder="Name"
                                      value={nameReadlist}
                                      onChange={(e) =>
                                        setNameReadlist(e.target.value)
                                      }
                                      className="w-full rounded-lg border p-2 outline-none"
                                    />
                                  </div>

                                  <div className="mt-8 flex justify-between">
                                    <button
                                      type="button"
                                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                      onClick={handleCreateNewReadlist}
                                    >
                                      Create
                                    </button>
                                    <button
                                      type="button"
                                      className="inline-flex justify-center rounded-md border border-transparent bg-red-200 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                                      onClick={closeModal}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </Dialog.Panel>
                              </Transition.Child>
                            </div>
                          </div>
                        </Dialog>
                      </Transition>
                    </div>
                  )}
                </div>
                <button className="flex items-center gap-1 rounded-xl border px-2 py-1 hover:bg-slate-100 md:hidden">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="#757575"
                    className="h-8 w-8 text-textBio hover:text-textNavbar"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                    />
                  </svg>
                  <span className="text-sm font-normal text-textBio  md:text-xl">
                    Save
                  </span>
                </button>

                <Link href={`./report/${props.post.id}`}>
                  {!isReported ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="#757575"
                      className="h-8 w-8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-8 w-8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                </Link>
              </div>
            </div>

            <div className="">
              <h1 className="w-4/5 py-5 text-xl font-[700] text-title md:py-10 md:text-3xl lg:text-4xl">
                {props.post.title}
              </h1>
              <div className="prose prose-sm md:prose-base lg:prose-lg">
                {parse(props.post.content || "")}
              </div>

              <Options
                published={props.post.published}
                id={props.post.id}
                reaction={props.post.reaction}
              />
              {/* <Comments currentUserId="1" /> */}
            </div>
          </div>
          <RightContent>
            <Image
              src={props.post.author.image || ""}
              alt="avatar"
              width={768}
              height={432}
              className="h-20 w-20 rounded-full object-cover"
            />
            <h1 className="text-lg font-medium md:text-xl">
              {props.post.author.name}
            </h1>
            <span className=" text-sm font-normal  text-textBio md:text-base">{`${props.post.author.followedBy.length} Followers`}</span>
            <p className=" text-lg font-normal text-textBio">
              {props.post.author.bio}
            </p>
            {props.post.authorId !== session?.user.id && (
              <button
                title="follow"
                onClick={handleFollow}
                className="mt-10 flex h-8 w-20 items-center justify-center rounded-3xl bg-button px-2 py-2 text-base font-normal text-white hover:bg-buttonHover"
              >
                {isFollowed ? "UnFollow" : "Follow"}
              </button>
            )}
          </RightContent>
        </Content>
      ) : (
        <LoadingScreen />
      )}
    </Layout>
  );
};

export default Post;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const id = context.query.id as string;

  const data = await prisma.post.findUnique({
    where: {
      id: id,
    },
    include: {
      author: {
        include: {
          followedBy: true,
        },
      },
      readLists: true,
      reaction: true,
    },
  });

  return {
    props: {
      post: JSON.parse(JSON.stringify(data)) as Post & {
        author: User & {
          followedBy: Follows[];
        };
        readLists: PostReadList[];
        reaction: Reaction[];
      },
    },
  };
}

function Options({
  published,
  id,
  reaction,
}: {
  published: boolean;
  id: string;
  reaction: Reaction[];
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const temp = reaction.find((item) => item.userId === session?.user.id);
  const [isActive, setIsActive] = useState(temp ? true : false);
  useEffect(() => {
    setIsActive(temp ? true : false);
  }, [temp]);

  const mutationCreate = api.reaction.create.useMutation();
  const mutationDelete = api.reaction.delete.useMutation();
  const handleReaction = () => {
    if (isActive) {
      mutationDelete.mutate(id);
      setIsActive(false);
    } else {
      mutationCreate.mutate(id);
      setIsActive(true);
    }
  };
  const handlePublish = async (id: string) => {
    await router
      .push({
        pathname: "/publish",
        query: {
          id: id,
        },
      })
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="flex justify-center">
      {!published && 
        // (<div className="fixed bottom-10 flex items-center gap-5 rounded-xl bg-slate-100 px-2 py-1">
        //   <button className="flex items-center gap-1" onClick={handleReaction}>
        //     {isActive ? (
        //       <svg
        //         xmlns="http://www.w3.org/2000/svg"
        //         viewBox="0 0 24 24"
        //         fill="#757575"
        //         className="h-8 w-8"
        //       >
        //         <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
        //       </svg>
        //     ) : (
        //       <svg
        //         xmlns="http://www.w3.org/2000/svg"
        //         fill="none"
        //         viewBox="0 0 24 24"
        //         strokeWidth={1.5}
        //         stroke="#757575"
        //         className="h-8 w-8"
        //       >
        //         <path
        //           strokeLinecap="round"
        //           strokeLinejoin="round"
        //           d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        //         />
        //       </svg>
        //     )}

        //     <span className="text-lg font-normal text-textBio">
        //       {reaction.length}
        //     </span>
        //   </button>
        //   <Link href={`./report/${id}`} className="flex items-center gap-1">
        //     <svg
        //       xmlns="http://www.w3.org/2000/svg"
        //       fill="none"
        //       viewBox="0 0 24 24"
        //       strokeWidth={1.5}
        //       stroke="#757575"
        //       className="h-8 w-8 text-textNavbar"
        //     >
        //       <path
        //         strokeLinecap="round"
        //         strokeLinejoin="round"
        //         d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
        //       />
        //     </svg>
        //     <span className="text-lg font-normal text-textBio">Report</span>
        //   </Link>
        // </div>
      // ):
            (
        <div className="fixed bottom-10  ">
          <button
            onClick={() => handlePublish(id)}
            className="rounded-3xl bg-button px-4 py-2 text-sm text-white hover:bg-buttonHover"
          >
            Publish
          </button>
        </div>
      )}
    </div>
  );
}
