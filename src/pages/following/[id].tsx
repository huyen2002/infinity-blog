import { type Follows, type User } from "@prisma/client";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import Content from "~/components/Content";
import Layout from "~/components/Layout";
import LeftContent from "~/components/LeftContent";
import Navbar from "~/components/Navbar";
import RightContent from "~/components/RightContent";
import Profile, { SmProfile } from "~/components/account/Profile";
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
  let user:
    | (User & {
        followedBy: (Follows & {
          follower: User;
        })[];
        following: (Follows & {
          following: User;
        })[];
      })
    | null
    | undefined;
  if (session?.user.id === id) {
    user = api.user.me.useQuery().data;
  } else {
    user = api.user.getOneWhereId.useQuery(id).data;
  }
  const followings = user?.following.map(({ following }) => following);

  return (
    <Layout>
      <Navbar />
      <Content>
        <LeftContent>
          <div className="flex flex-col gap-10">
            <SmProfile id={session?.user.id || ""} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-medium text-textNavbar">
                  Following
                </h1>
                <span>{followings?.length}</span>
              </div>

              {followings && followings?.length > 0 && (
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
                      {followings?.map((user) => {
                        return (
                          <tr key={user?.id} className="border-b bg-white  ">
                            <td
                              scope="row"
                              className="flex items-center gap-2 whitespace-nowrap px-6 py-4 font-medium text-gray-900 "
                            >
                              <Image
                                src={user?.image || "/avatar.png"}
                                alt="avatar"
                                width={40}
                                height={40}
                                className="h-12 w-12 rounded-full"
                              />
                              <span>{user?.name}</span>
                            </td>
                            <td className="px-6 py-4">{user?.email}</td>
                            {session?.user.id === id && (
                              <td className="px-6 py-4">
                                <button
                                  onClick={() => handleUnFollow(user?.id)}
                                  className="h-8 w-20 rounded-full border border-button text-buttonHover hover:bg-buttonHover hover:text-white"
                                >
                                  Un follow
                                </button>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </LeftContent>
        <RightContent>
          <Profile id={id} />
        </RightContent>
      </Content>
    </Layout>
  );
};
export default Following;
