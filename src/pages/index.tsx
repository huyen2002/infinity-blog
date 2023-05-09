import { Menu, Transition } from "@headlessui/react";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { Fragment } from "react";
import Brand from "../components/Brand";
import Layout from "../components/Layout";
const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Infinity</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Layout>
          <div className="flex h-28 items-center justify-between">
            <Brand />
            <div className="hidden items-center justify-between font-montserrat sm:flex sm:w-48 md:w-52 lg:w-80">
              <button className="text-base font-normal md:text-lg xl:text-xl">
                <Link href="/auth/signin">Sign in</Link>
              </button>
              <button className="rounded-full bg-button px-3 py-2 text-base font-normal text-white md:text-lg lg:px-5 xl:text-xl">
                <Link href="/auth/signup">Sign up</Link>
              </button>
            </div>

            <div className="sm:hidden">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="border-spacing-1 rounded-lg border border-black bg-white p-2 hover:bg-slate-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                      />
                    </svg>
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-4 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-1 py-1 ">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active ? "bg-button text-white" : "text-gray-900"
                            } group flex w-full items-center rounded-md px-2 py-2 text-base`}
                          >
                            <Link href="/auth/signup">Sign up</Link>
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                    <div className="px-1 py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active ? "bg-button text-white" : "text-gray-900"
                            } group flex w-full items-center rounded-md px-2 py-2 text-base`}
                          >
                            <Link href="/auth/signin">Sign in</Link>
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>

          <div className="flex h-[calc(100vh-7rem)] max-w-full items-center pb-20 ">
            <div className="">
              <div className="w-2/5">
                <span className=" text-3xl font-bold text-black/80 sm:text-5xl lg:text-7xl">
                  Growing unstoppably
                  {/* <AuthShowcase /> */}
                </span>
              </div>

              <span className="mt-5 inline-block font-montserrat text-lg font-normal text-black/80 sm:mt-10 sm:text-xl lg:text-2xl">
                Discover stories and expand your knowledge about more fields
              </span>
            </div>
          </div>
        </Layout>
      </main>
    </>
  );
};

export default Home;
