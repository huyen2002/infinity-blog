import { type inferRouterOutputs } from "@trpc/server";
import { useEffect, useState } from "react";
import Pagination, { postsPerPage } from "~/components/Pagination";
import Searchbar from "~/components/admin/Searchbar";
import Sidebar from "~/components/admin/Sidebar";
import { type AppRouter } from "~/server/api/root";
import { api } from "~/utils/api";
const Topics = () => {
  const { data } = api.topic.getAll.useQuery();
  const [currentPage, setCurrentPage] = useState(1);

  const [search, setSearch] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1);
    e.persist();
    setSearch(e.target.value);
  };
  const [searchResult, setSearchResult] = useState<
    inferRouterOutputs<AppRouter>["topic"]["getAll"] | undefined
  >(data);

  useEffect(() => {
    const results = data?.filter(
      (topic) =>
        topic && topic.name.toLowerCase().startsWith(search.toLowerCase())
    );
    setSearchResult(results);
  }, [search, data]);

  // Get current posts to paginate
  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts:
    | inferRouterOutputs<AppRouter>["topic"]["getAll"]
    | undefined = searchResult?.slice(firstPostIndex, lastPostIndex);
  return (
    <div className="flex">
      <Sidebar />

      <div className="ml-10 mt-10">
        <h1 className="text-lg font-semibold text-textNavbar md:text-3xl">
          Topics
        </h1>
        <Searchbar
          placeholder="Search by user email"
          handleChange={handleChange}
        />
        {currentPosts && (
          <div className="mt-10 overflow-x-auto ">
            <table className="w-full text-left text-sm text-gray-500 ">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700 ">
                <tr>
                  <th scope="col" className="px-20 py-3">
                    Id
                  </th>
                  <th scope="col" className="px-20 py-3">
                    Topic
                  </th>

                  <th scope="col" className="px-20 py-3">
                    Posts
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentPosts?.map((topic) => {
                  return (
                    <tr key={topic?.id} className="border-b bg-white  ">
                      <td className="px-20 py-4">{topic?.id}</td>

                      <td className="px-20 py-4">{topic?.name}</td>
                      <td className="px-20 py-4">{topic?.post.length}</td>
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
export default Topics;
