import type { User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import LoadingScreen from "~/components/LoadingScreen";
import Pagination from "~/components/Pagination";
import Sidebar from "~/components/admin/Sidebar";
import { defaultParams, defaultParamsAdmin } from "~/constants/QueryParams";
import { api } from "~/utils/api";
const Users = () => {
  const [page, setPage] = useState<number>(defaultParams.page);

  const { data, isFetching } = api.user.getAll.useQuery(
    {
      page: page,
      size: defaultParamsAdmin.size,
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const users: User[] = data ? data.data : [];
  return (
    <div className="mr-10 flex">
      <Sidebar />

      {!isFetching ? (
        <div className="ml-10 mr-5 mt-10 w-full">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-textNavbar md:text-3xl">
              Users
            </h1>
            <span className="text-base font-semibold text-textNavbar md:text-lg">
              {data?.total}
            </span>
          </div>
          {users && (
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
                    <th scope="col" className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((user) => {
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
                              src={user?.image || "/blank_user.png"}
                              alt="avatar"
                              width={40}
                              height={40}
                              className="h-12 w-12 rounded-full"
                            />
                            <span>{user?.name}</span>
                          </Link>
                        </td>
                        <td className="px-6 py-4">{user?.email}</td>
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
          <div className="mt-5">
            <Pagination
              total={data ? data.total : 0}
              setPage={setPage}
              current={page}
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
export default Users;
