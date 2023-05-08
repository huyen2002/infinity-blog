import { type NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { type FieldValues, type SubmitHandler, useForm } from "react-hook-form";
import Content from "../../../components/Content";
import Layout from "../../../components/Layout";
import Navbar from "../../../components/Navbar";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";

const Report: NextPage = () => {
  const { register, handleSubmit } = useForm();
  const router = useRouter();
  const { id } = router.query as { id: string };
  const mutation = api.report.create.useMutation({
    onSuccess: () => {
      void router.push(`/post/${id}`);
    },
  });
  const { data: session } = useSession();
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    console.log(data);
    mutation.mutate({
      postId: id,
      userId: session?.user?.id || "",
      reason: data.reason as string,
    });
  };

  return (
    <Layout>
      <Navbar />
      <Content>
        <div></div>
        <form
          className="m-auto flex flex-col gap-5 rounded-sm px-10 py-10 shadow"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="text-2xl font-medium text-textNavbar md:text-3xl">
            Report Story
          </h1>
          <h2 className="text-lg font-normal text-textNavbar md:text-xl">
            Please select the reason for reporting this story.
          </h2>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="inappropriate"
                {...register("reason")}
                value="inappropriate"
                className="h-3 w-3 md:h-4 md:w-4"
              />
              <label className="text-base md:text-lg" htmlFor="inappropriate">
                Inappropriate
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="spam"
                {...register("reason")}
                value="spam"
                className="h-3 w-3 md:h-4 md:w-4"
              />
              <label className="text-base md:text-lg" htmlFor="spam">
                Spam
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="harassment"
                {...register("reason")}
                value="harassment"
                className="h-3 w-3 md:h-4 md:w-4"
              />
              <label className="text-base md:text-lg" htmlFor="harassment">
                Harassment
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="other"
                {...register("reason")}
                value="other"
                className="h-3 w-3 md:h-4 md:w-4"
              />
              <label className="text-base md:text-lg" htmlFor="other">
                Other
              </label>
            </div>
          </div>

          <div className="mt-5 flex justify-between">
            <button
              type="submit"
              className="rounded-3xl bg-red-600 px-5 py-2 text-base text-white hover:bg-red-500 md:text-lg"
            >
              Report
            </button>
            <Link
              href={`/post/${id}`}
              className="rounded-3xl border border-button px-5 py-2 text-base hover:bg-buttonHover hover:text-white md:text-lg"
            >
              Cancel
            </Link>
          </div>
        </form>
      </Content>
    </Layout>
  );
};
export default Report;
