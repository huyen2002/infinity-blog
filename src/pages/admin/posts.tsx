import { Post, Report, Topic, User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import LoadingScreen from "~/components/LoadingScreen";
import Pagination from "~/components/Pagination";
import Sidebar from "~/components/admin/Sidebar";
import { defaultParams, defaultParamsAdmin } from "~/constants/QueryParams";
import { api } from "~/utils/api";
const Posts = () => {
  const [page, setPage] = useState<number>(defaultParams.page);
  const { data, isFetching } = api.post.getAll.useQuery(
    {
      page: page,
      size: defaultParamsAdmin.size,
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const posts: (Post & {
    topic: Topic | null;
    report: Report[];
    author: User;
  })[] = data ? data.data : [];
  const utils = api.useContext();
  const mutation = api.post.deleteOneWhereId.useMutation({
    onSuccess() {
      void utils.post.invalidate();
    },
  });
  const handleDelete = (id: string) => {
    mutation.mutate(id);
  };
  return (
    <div className="mr-10 flex">
      <Sidebar />
      {!isFetching ? (
        <div className="ml-10 mt-10">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-textNavbar md:text-3xl">
              Posts
            </h1>
            <span className="text-base font-semibold text-textNavbar md:text-lg">
              {data?.total}
            </span>
          </div>

          {posts && (
            <div className="mt-10 overflow-x-auto pr-10 ">
              <table className="w-full text-left text-sm text-gray-500 ">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700 ">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Author
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Topic
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Report
                    </th>
                    <th scope="col" className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {posts?.map((post) => {
                    return (
                      <tr key={post?.id} className="border-b bg-white  ">
                        <td className="px-6 py-4">{post?.id}</td>
                        <td className="px-6 py-4">{post?.title}</td>
                        <td
                          scope="row"
                          className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 "
                        >
                          <Link
                            href={`/user/${post?.id}`}
                            className="flex items-center gap-2"
                          >
                            <Image
                              src={post?.author?.image || "/blank_user.png"}
                              alt="avatar"
                              width={40}
                              height={40}
                              className="h-12 w-12 rounded-full"
                            />
                            <span>{post?.author.name}</span>
                          </Link>
                        </td>

                        <td className="px-6 py-4">{post?.topic?.name}</td>
                        <td className="px-6 py-4">{post?.report.length}</td>

                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="h-8 w-14 rounded-full border border-red-300 text-red-500 hover:bg-red-400 hover:text-white"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-5">
            <Pagination
              total={data ? data.total : 0}
              current={page}
              setPage={setPage}
              pageSize={defaultParamsAdmin.size}
            />
          </div>
        </div>
      ) : (
        <LoadingScreen />
      )}
    </div>
  );
};
export default Posts;
