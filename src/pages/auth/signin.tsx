import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import { getProviders, signIn } from "next-auth/react";

import { getServerSession } from "next-auth";
import Image from "next/image";
import { authOptions } from "~/server/auth";
import Brand from "../../components/Brand";
import Layout from "../../components/Layout";
function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  //sign in with google

  return (
    <Layout>
      <div className="flex h-28 max-w-full items-center justify-center">
        <div className="flex items-center justify-between">
          {/* <Image
              src="/logo.png"
              alt="logo"
              className="object-cover "
              width={100}
              height={100}
            />
            <h1 className="font-pacifico text-4xl not-italic leading-[7rem] text-black/80 md:text-6xl">
              Infinity
            </h1> */}
          <Brand />
        </div>
      </div>
      <form
        method="post"
        action="/api/auth/callback/credentials"
        className="m-auto my-8 flex w-full flex-col gap-4 font-montserrat text-base sm:w-2/3 md:text-lg lg:w-1/3"
      >
        <input name="csrfToken" type="hidden" />
        <div className="flex flex-col gap-2">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            className="rounded-lg  border border-[#e6e6e6] px-2  py-2"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="rounded-lg  border border-[#e6e6e6] px-2  py-2 "
          />
        </div>
        <button
          type="submit"
          className="mt-5 rounded-xl bg-button px-5 py-2 text-lg font-normal text-white md:text-xl"
        >
          Sign in
        </button>
        {/* <span className="my-5 flex justify-center">Or</span> */}

        {/* <button
          onClick={() => signIn()}
          className=" flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-lg font-normal text-gray-700 shadow-md md:text-lg"
        >
          <Image src="/google.png" width={30} height={30} alt="google_icon" />

          <p>Sign in with Google</p>
        </button> */}
      </form>
      <div className=" m-auto my-8 flex w-full flex-col gap-4 font-montserrat text-base sm:w-2/3 md:text-lg lg:w-1/3">
        <span className="flex justify-center">Or</span>

        {Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button
              onClick={() => signIn(provider.id)}
              className="flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-lg font-normal text-gray-700 shadow-md md:text-lg"
            >
              <Image
                src="/google.png"
                width={30}
                height={30}
                alt="google_icon"
              />
              Sign in with {provider.name}
            </button>
          </div>
        ))}
      </div>
    </Layout>
  );
}
export default SignIn;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: "/home" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
