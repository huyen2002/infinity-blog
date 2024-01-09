import { type Follows, type User } from "@prisma/client";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ConfirmModal from "~/components/ConfirmModal";
import Content from "~/components/Content";
import Layout from "~/components/Layout";
import LoadingScreen from "~/components/LoadingScreen";
import Navbar from "~/components/Navbar";
import Pagination from "~/components/Pagination";
import { SmProfile } from "~/components/account/Profile";
import { defaultParams } from "~/constants/QueryParams";
import { api } from "~/utils/api";
const Follower: NextPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = router.query as { id: string };
  const { data: user, isFetching: fetching } =
    api.user.getOneWhereId.useQuery(id);
  const [page, setPage] = useState<number>(defaultParams.page);

  const { data, isFetching } = api.follows.getFollowersByUserId.useQuery({
    id: id,
    params: {
      page: page,
      size: defaultParams.size,
    },
  });
  const followers: (Follows & {
    follower: User;
  })[] = data ? data.data : [];

  const utils = api.useContext();
  const mutation = api.follows.block.useMutation({
    onSuccess() {
      void utils.user.invalidate();
    },
  });
  const handleBlock = (id: string) => {
    mutation.mutate(id);
  };
  const handleSetPage = (page: number) => {
    setPage(page);
  };
  const [openModal, setOpenModal] = useState<boolean>(false);

  useEffect(() => {
    console.log(mutation);
    if (!mutation.isLoading) {
      if (mutation.isSuccess) {
        toast.success("Block account successfully");
      }
      if (mutation.error) {
        toast.error(`Block account error: ${mutation.error.message}`);
      }
    }
  }, [mutation.isLoading]);
  return (
    <Layout>
      <Navbar />
      <Content>
        <div className=" h-full w-full">
          {!isFetching && !fetching ? (
            <div className="flex w-full flex-col gap-5">
              <SmProfile user={user} />

              <nav className="flex" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 rtl:space-x-reverse md:space-x-2">
                  <li className="inline-flex items-center">
                    <a
                      href={`/user/${id}`}
                      className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                    >
                      {user?.name}
                    </a>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <svg
                        className="mx-1 h-3 w-3 text-gray-400 rtl:rotate-180"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 6 10"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="m1 9 4-4-4-4"
                        />
                      </svg>
                      <a
                        href="#"
                        className="ms-1 text-sm font-medium text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white md:ms-2"
                      >
                        Follower
                      </a>
                    </div>
                  </li>
                </ol>
              </nav>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-medium text-textNavbar">
                    Follower
                  </h1>
                  <span>{data?.total}</span>
                </div>
                {followers && followers.length > 0 ? (
                  <div>
                    <div className="mt-10 overflow-x-auto">
                      <table className="w-full text-left text-sm text-gray-500 ">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-700 ">
                          <tr>
                            <th scope="col" className="px-6 py-3">
                              User
                            </th>
                            <th scope="col" className="px-6 py-3">
                              Email
                            </th>

                            {session?.user.id === id && (
                              <th scope="col" className="px-6 py-3"></th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {followers?.map((follow) => {
                            return (
                              <tr
                                key={follow?.followerId}
                                className="border-b bg-white  "
                              >
                                <td
                                  scope="row"
                                  className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 "
                                >
                                  <Link
                                    href={`/user/${follow?.followerId}`}
                                    className="flex items-center gap-2"
                                  >
                                    <Image
                                      src={
                                        follow?.follower.image || "/avatar.png"
                                      }
                                      alt="avatar"
                                      width={40}
                                      height={40}
                                      className="h-12 w-12 rounded-full object-cover  "
                                    />
                                    <span>{follow?.follower.name}</span>
                                  </Link>
                                </td>
                                <td className="px-6 py-4">
                                  {follow?.follower.email}
                                </td>
                                {session?.user.id === id && (
                                  <td className="px-6 py-4">
                                    <button
                                      onClick={() => setOpenModal(true)}
                                      className="h-8 w-14 rounded-full border border-button text-buttonHover hover:bg-buttonHover hover:text-white"
                                    >
                                      Block
                                    </button>
                                    <ConfirmModal
                                      open={openModal}
                                      setOpen={setOpenModal}
                                      content="Are you sure to block this account? This account can't follow you."
                                      buttonName="Block"
                                      onClick={() =>
                                        handleBlock(follow?.followerId)
                                      }
                                      isLoading={mutation.isLoading}
                                    />
                                  </td>
                                )}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-5">
                      <Pagination
                        current={page}
                        total={data?.total || 0}
                        setPage={(page) => handleSetPage(page)}
                        pageSize={defaultParams.size}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mt-5">
                    <span className="text-lg">
                      This account has no follower
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <LoadingScreen />
          )}
        </div>
      </Content>
    </Layout>
  );
};
export default Follower;
