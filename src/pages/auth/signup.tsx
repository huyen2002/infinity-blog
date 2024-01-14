import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { api } from "~/utils/api";
import Brand from "../../components/Brand";
import Layout from "../../components/Layout";

interface IFormInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
const SignUp: NextPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IFormInput>();

  const router = useRouter();

  const mutation = api.user.create.useMutation({
    async onSuccess() {
      await router.push("/auth/signin");
      toast.success("Register successfully");
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = (data: IFormInput) => {
    alert(JSON.stringify(data));
    mutation.mutate({
      email: data.email,
      name: data.name,
      password: data.password,
    });
  };
  return (
    <Layout>
      <div className="flex h-28 max-w-full items-center justify-center">
        <div className="flex items-center justify-between">
          <Brand />
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="m-auto my-8 flex w-full flex-col gap-4 font-montserrat text-base sm:w-2/3 md:text-lg lg:w-1/3"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="name">User name</label>
          <input
            type="text"
            id="name"
            className="rounded-lg  border border-input px-2 py-2 focus:outline-1  focus:outline-inputFocus "
            {...register("name", { required: true })}
          />
          {errors.name && errors.name.type === "required" && (
            <span className="text-red-400">This field is required</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="rounded-lg  border border-input px-2 py-2 focus:outline-1  focus:outline-inputFocus "
            {...register("email", {
              required: {
                value: true,
                message: "Please enter your email",
              },
              pattern: {
                value:
                  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: "Please enter a valid email",
              },
            })}
          />

          {errors.email && (
            <span className="text-red-400">{errors.email.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="rounded-lg border border-input px-2 py-2 focus:outline-1  focus:outline-inputFocus"
            {...register("password", {
              required: {
                value: true,
                message: "Please enter your password",
              },

              pattern: {
                value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
                message:
                  "Must contain at least one number and one uppercase and lowercase letter, and at least 6 or more characters",
              },
            })}
          />

          {errors.password && (
            <span className="text-red-400">{errors.password.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="confirmPassword">Confirm password</label>
          <input
            type="password"
            id="confirmPassword"
            className="rounded-lg  border border-input px-2 py-2 focus:outline-1  focus:outline-inputFocus"
            {...register("confirmPassword", {
              required: {
                value: true,
                message: "Please confirm your password",
              },
              validate: (value) =>
                value === watch("password") || "The passwords do not match",
            })}
          />
        </div>

        {errors.confirmPassword && (
          <span className="text-red-400">{errors.confirmPassword.message}</span>
        )}

        <button
          type="submit"
          className="mb-10 mt-10 rounded-xl bg-button px-5 py-2 text-lg font-normal text-white md:text-2xl"
        >
          {mutation.isLoading && (
            <svg
              aria-hidden="true"
              role="status"
              className="me-3 inline h-4 w-4 animate-spin text-white"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor"
              />
            </svg>
          )}
          Sign up
        </button>
      </form>
    </Layout>
  );
};
export default SignUp;
