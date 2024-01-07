import { Dialog, Transition } from "@headlessui/react";
import { type Follows, type User } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { api } from "~/utils/api";

function Profile({ id }: { id: string }) {
  const { data: session } = useSession();
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
  if (session?.user?.id === id) {
    user = api.user.me.useQuery().data;
  } else {
    user = api.user.getOneWhereId.useQuery(id).data;
  }

  return (
    <div className="flex flex-col gap-5">
      <Image
        src={user?.image || ""}
        alt="avatar"
        width={500}
        height={500}
        className="rounded-full md:h-28 md:w-28 xl:h-40 xl:w-40"
      />
      <h1 className="text-2xl font-medium text-textNavbar">{user?.name}</h1>
      <p className="text-lg font-normal">{user?.bio}</p>
      {session?.user?.id === id && <EditProfile />}
      <div className="flex items-center gap-2">
        <Link
          href={`/follower/${user?.id || ""}`}
          className="text-xs font-semibold text-textNavbar md:text-base"
        >
          Follower
        </Link>
        <p>{user?.followedBy?.length}</p>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href={`/following/${user?.id || ""}`}
          className="text-xs font-semibold text-textNavbar md:text-base"
        >
          Following
        </Link>
        <p>{user?.following?.length}</p>
      </div>
    </div>
  );
}
export default Profile;

export function SmProfile({ id }: { id: string }) {
  const { data: session } = useSession();
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
  if (session?.user?.id === id) {
    user = api.user.me.useQuery().data;
  } else {
    user = api.user.getOneWhereId.useQuery(id).data;
  }

  return (
    <div className="z-100 mt-5 flex flex-col gap-4 md:hidden">
      <Image
        src={user?.image || ""}
        width={500}
        height={500}
        alt="avatar"
        className=" h-20 w-20 max-w-none rounded-full object-cover"
      />
      <h1 className="text-xl font-medium text-textNavbar">{user?.name}</h1>
      <p className="text-base font-normal">{user?.bio} </p>
      {/* <button className="rounded-full border border-blue-700 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-slate-100">
        Edit profile
      </button> */}
      {session?.user?.id === id && <EditProfile />}

      <div>
        <h2>Follower</h2>
        <p>{user?.followedBy?.length}</p>
      </div>
      <div>
        <h2>Following</h2>
        <p>{user?.following?.length}</p>
      </div>
    </div>
  );
}

function EditProfile() {
  interface FormValues {
    name: string;
    bio: string;
  }
  const { data: user } = api.user.me.useQuery();

  const [isOpen, setIsOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<FormValues>();
  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  // function onSubmit(data: FormValues) {
  //   console.log(data);
  //   setIsOpen(false);
  // }
  const utils = api.useContext();
  const mutation = api.user.edit.useMutation({
    onSuccess() {
      void utils.user.invalidate();
    },
  });
  const onSubmit: SubmitHandler<FormValues> = (data: FormValues) => {
    console.log(data);
    mutation.mutate({
      name: data.name,
      bio: data.bio,
    });
    setIsOpen(false);
  };
  useEffect(() => {
    reset({
      name: user?.name || "",
      bio: "",
    });
  }, [isOpen, reset]);

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={openModal}
        className="w-full rounded-full border border-blue-700 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-buttonHover hover:text-white"
      >
        Edit profile
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
                    Edit Profile
                  </Dialog.Title>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mt-4">
                      <label
                        htmlFor="name"
                        className="block text-base font-medium text-gray-700"
                      >
                        Name
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          {...register("name", { required: true })}
                          id="name"
                          placeholder="Nguyen Thanh Huyen"
                          className="block w-full rounded-md bg-slate-100 p-2  focus:outline-button"
                          autoFocus
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label
                        htmlFor="bio"
                        className="block text-base font-medium text-gray-700"
                      >
                        Bio
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          {...register("bio")}
                          id="bio"
                          className="block w-full rounded-md bg-slate-100 p-2 focus:outline-button"
                          autoFocus
                        />
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <button
                        type="submit"
                        className="mt-5 rounded-lg bg-button px-4 py-2 text-white hover:bg-buttonHover"
                      >
                        Complete
                      </button>

                      <button
                        className="mt-5 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-500"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
