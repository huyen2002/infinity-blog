import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm, type FieldValues, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { api } from "~/utils/api";
import Content from "../../../components/Content";
import Layout from "../../../components/Layout";
import Navbar from "../../../components/Navbar";

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
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    console.log(data);
    mutation.mutate({
      postId: id,
      userId: session?.user?.id || "",
      reason: data.reason as string,
    });
    await router.push(`/post/${id}`);
    toast.success("Reported successfully");
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
              {mutation.isLoading && (
                <svg
                  aria-hidden="true"
                  role="status"
                  className="mr-3 inline h-4 w-4 animate-spin text-white"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#E5E7EB"
                  ></path>
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentColor"
                  ></path>
                </svg>
              )}
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
