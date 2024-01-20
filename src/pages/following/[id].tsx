import type { Follows, User } from "@prisma/client";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Image from "next/image";
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
const Following: NextPage = () => {
  const utils = api.useContext();
  const mutation = api.follows.delete.useMutation({
    onSuccess() {
      void utils.user.invalidate();
    },
  });
  const handleUnFollow = (id: string) => {
    mutation.mutate(id);
  };
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = router.query as { id: string };
  const { data: user, isFetching: fetching } =
    api.user.getOneWhereId.useQuery(id);
  const [page, setPage] = useState<number>(defaultParams.page);

  const { data, isFetching } = api.follows.getFollowingsByUserId.useQuery(
    {
      id: id,
      params: {
        page: page,
        size: defaultParams.size,
      },
    },
    { refetchOnWindowFocus: false }
  );

  const followings: (Follows & {
    following: User;
  })[] = data ? data.data : [];
  const handleSetPage = (page: number) => {
    setPage(page);
  };

  const [openModal, setOpenModal] = useState<boolean>(false);

  useEffect(() => {
    if (!mutation.isLoading) {
      if (mutation.isSuccess) {
        toast.success("Un follow account successfully");
      }
      if (mutation.error) {
        toast.error(`Un follow account error: ${mutation.error.message}`);
      }
    }
  }, [mutation.isLoading]);
  return (
    <Layout>
      <Navbar />
      <Content>
        <div className=" h-full w-full">
          {!isFetching && !fetching ? (
            <div className="flex flex-col gap-5">
              <SmProfile id={user?.id} />
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
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m1 9 4-4-4-4"
                        />
                      </svg>
                      <a
                        href="#"
                        className="ms-1 text-sm font-medium text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white md:ms-2"
                      >
                        Following
                      </a>
                    </div>
                  </li>
                </ol>
              </nav>
              <div className="h-full">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-medium text-textNavbar">
                    Following
                  </h1>
                  <span>{data?.total}</span>
                </div>
                <div className="">
                  {followings && followings.length > 0 ? (
                    <div>
                      <div className="mt-10 ">
                        <table className="w-full text-left text-sm text-gray-500 ">
                          <thead className="bg-gray-50 text-xs uppercase text-gray-700 ">
                            <tr>
                              <th scope="col" className="px-6 py-3">
                                ID
                              </th>
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
                            {followings?.map((follow) => {
                              return (
                                <tr
                                  key={follow?.followingId}
                                  className="border-b bg-white  "
                                >
                                  <td>{follow.followingId}</td>

                                  <td
                                    scope="row"
                                    className="flex items-center gap-2 whitespace-nowrap px-6 py-4 font-medium text-gray-900 "
                                  >
                                    <Image
                                      src={
                                        follow?.following.image || "/avatar.png"
                                      }
                                      alt="avatar"
                                      width={40}
                                      height={40}
                                      className="h-12 w-12 rounded-full"
                                    />
                                    <span>{follow?.following.name}</span>
                                  </td>
                                  <td className="px-6 py-4">
                                    {follow?.following.email}
                                  </td>
                                  {session?.user.id === id && (
                                    <td className="px-6 py-4">
                                      <button
                                        onClick={() => setOpenModal(true)}
                                        className="h-8 w-20 rounded-full border border-button text-buttonHover hover:bg-buttonHover hover:text-white"
                                      >
                                        Un follow
                                      </button>
                                      <ConfirmModal
                                        open={openModal}
                                        setOpen={setOpenModal}
                                        content="Are you sure to un follow this account? You can follow this account later."
                                        buttonName="Un follow"
                                        onClick={() =>
                                          handleUnFollow(follow?.followingId)
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
                      <div className=" mt-5">
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
                        This account has no following
                      </span>
                    </div>
                  )}
                </div>
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
export default Following;
