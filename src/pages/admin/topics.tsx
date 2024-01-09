import LoadingScreen from "~/components/LoadingScreen";
import Sidebar from "~/components/admin/Sidebar";
import { api } from "~/utils/api";
const Topics = () => {
  const { data, isFetching } = api.topic.getAll.useQuery();

  return (
    <div className="mr-10 flex">
      <Sidebar />
      {!isFetching ? (
        <div className="ml-10 mt-10">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-textNavbar md:text-3xl">
              Topics
            </h1>
            <span className="text-base font-semibold text-textNavbar md:text-lg">
              {data?.length}
            </span>
          </div>
          {data && (
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
                  {data?.map((topic) => {
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
        </div>
      ) : (
        <LoadingScreen />
      )}
    </div>
  );
};
export default Topics;
