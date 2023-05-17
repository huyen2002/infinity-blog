import { type inferRouterOutputs } from "@trpc/server";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Pagination, { postsPerPage } from "~/components/Pagination";
import Searchbar from "~/components/admin/Searchbar";
import Sidebar from "~/components/admin/Sidebar";
import { type AppRouter } from "~/server/api/root";
import { api } from "~/utils/api";
const Posts = () => {
  const { data } = api.post.getAll.useQuery();
  const [currentPage, setCurrentPage] = useState(1);

  const [search, setSearch] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1);
    e.persist();
    setSearch(e.target.value);
  };
  const [searchResult, setSearchResult] = useState<
    inferRouterOutputs<AppRouter>["post"]["getAll"] | undefined
  >(data);

  useEffect(() => {
    const results = data?.filter((post) =>
      post.id.toLowerCase().startsWith(search.toLowerCase())
    );
    setSearchResult(results);
  }, [search, data]);

  // Get current posts to paginate
  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts:
    | inferRouterOutputs<AppRouter>["post"]["getAll"]
    | undefined = searchResult?.slice(firstPostIndex, lastPostIndex);

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
    <div className="flex">
      <Sidebar />

      <div className="ml-10 mt-10">
        <h1 className="text-lg font-semibold text-textNavbar md:text-3xl">
          Posts
        </h1>
        <Searchbar
          placeholder="Search by post id"
          handleChange={handleChange}
        />
        {currentPosts && (
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
                {currentPosts?.map((post) => {
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
                            src={post?.author?.image || "/avatar.png"}
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
        <div className="flex w-full items-center justify-center">
          <Pagination
            totalPosts={data?.length ?? 0}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          />
        </div>
      </div>
    </div>
  );
};
export default Posts;
