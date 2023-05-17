import { type inferRouterOutputs } from "@trpc/server";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Pagination, { postsPerPage } from "~/components/Pagination";
import Searchbar from "~/components/admin/Searchbar";
import Sidebar from "~/components/admin/Sidebar";
import { type AppRouter } from "~/server/api/root";
import { api } from "~/utils/api";
const Users = () => {
  const { data } = api.user.getAll.useQuery();
  const [currentPage, setCurrentPage] = useState(1);

  const [search, setSearch] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1);
    e.persist();
    setSearch(e.target.value);
  };
  const [searchResult, setSearchResult] = useState<
    inferRouterOutputs<AppRouter>["user"]["getAll"] | undefined
  >(data);

  useEffect(() => {
    const results = data?.filter(
      (user) =>
        user &&
        user.email &&
        user.email.toLowerCase().startsWith(search.toLowerCase())
    );
    setSearchResult(results);
  }, [search, data]);

  // Get current posts to paginate
  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts:
    | inferRouterOutputs<AppRouter>["user"]["getAll"]
    | undefined = searchResult?.slice(firstPostIndex, lastPostIndex);
  return (
    <div className="flex">
      <Sidebar />

      <div className="ml-10 mt-10">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-textNavbar md:text-3xl">
            Users
          </h1>
          <span className="text-base font-semibold text-textNavbar md:text-lg">
            {data?.length}
          </span>
        </div>

        <Searchbar
          placeholder="Search by user email"
          handleChange={handleChange}
        />
        {currentPosts && (
          <div className="mt-10 overflow-x-auto ">
            <table className="w-full text-left text-sm text-gray-500 ">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700 ">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Id
                  </th>
                  <th scope="col" className="px-6 py-3">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Posts
                  </th>
                  <th scope="col" className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {currentPosts?.map((user) => {
                  return (
                    <tr key={user?.id} className="border-b bg-white  ">
                      <td className="px-6 py-4">{user?.id}</td>

                      <td
                        scope="row"
                        className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 "
                      >
                        <Link
                          href={`/user/${user?.id}`}
                          className="flex items-center gap-2"
                        >
                          <Image
                            src={user?.image || "/avatar.png"}
                            alt="avatar"
                            width={40}
                            height={40}
                            className="h-12 w-12 rounded-full"
                          />
                          <span>{user?.name}</span>
                        </Link>
                      </td>
                      <td className="px-6 py-4">{user?.email}</td>
                      <td className="px-6 py-4">{user?.post.length}</td>
                      <td className="px-6 py-4">
                        <button className="h-8 w-14 rounded-full border border-button text-buttonHover hover:bg-buttonHover hover:text-white">
                          Active
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
export default Users;
