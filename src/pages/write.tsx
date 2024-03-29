import { type NextPage } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm, type FieldValues, type SubmitHandler } from "react-hook-form";
import "react-quill/dist/quill.snow.css";
import { api } from "~/utils/api";
import Layout from "../components/Layout";
import Navbar from "../components/Navbar";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const Write: NextPage = () => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  const [description, setDescription] = useState<string>("");
  const [wordCount, setWordCount] = useState<number>(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    setValue,
    watch,
    reset,
  } = useForm();

  useEffect(() => {
    reset({
      data: "",
    });
  }, [isSubmitSuccessful, reset]);

  useEffect(() => {
    const words = description.split(" ");

    // update word count
    let wordCount = 0;
    words.forEach((word) => {
      if (word.trim() !== "") {
        wordCount++;
      }
    });
    setWordCount(wordCount);
  }, [description]);

  const handleQuillChange = (value: string) => {
    setValue("content", value);
  };

  useEffect(() => {
    register("content", { required: true });
  }, [register]);

  const content = watch("content") as string;

  const mutation = api.post.create.useMutation();
  const handleSaveAsDraft: SubmitHandler<FieldValues> = async (data) => {
    mutation.mutate({
      title: data.title as string,
      description: data.description as string,
      content: data.content as string,
    });
    await router
      .push("/account/drafts")
      .then(() => window.scrollTo(0, 0))
      .catch((err) => console.log(err));
  };
  const router = useRouter();
  const handlePublish: SubmitHandler<FieldValues> = async (data) => {
    await router
      .push({
        pathname: "/publish",
        query: {
          title: data.title as string,
          description: data.description as string,
          content: data.content as string,
        },
      })
      .then(() => window.scrollTo(0, 0))
      .catch((err) => console.log(err));
  };
  return (
    <Layout>
      <Navbar />
      <form method="POST">
        <input
          type="text"
          className="w-full py-1 text-lg outline-none md:text-5xl"
          placeholder="Title"
          {...register("title", { required: true })}
        />
        {errors?.title && (
          <span className="text-red-500">This field is required</span>
        )}
        <div className="my-2 flex flex-col gap-4">
          <div>
            <label htmlFor="description" className="mr-2 text-xl ">
              Description
            </label>
            <span>{`(Write at least 50 words)`}</span>
          </div>

          <textarea
            id="description"
            className="rounded border px-2 py-2 focus:outline-none"
            {...register("description", {
              required: true,
              validate: {
                minLength: (value: string) => {
                  const words = value.split(" ");
                  let wordCount = 0;
                  words.forEach((word) => {
                    if (word.trim() !== "") {
                      wordCount++;
                    }
                  });
                  return wordCount >= 50;
                },
              },
            })}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors?.description?.type === "required" && (
            <span className="text-red-500">This field is required</span>
          )}
          {errors?.description?.type === "minLength" && (
            <span className="text-red-500">
              Description must be at least 50 words
            </span>
          )}

          <div className="text-right">
            <span>{`Words: `}</span>
            <span>{wordCount}</span>
            <span>{`/50`}</span>
          </div>
        </div>
        <ReactQuill
          theme="snow"
          modules={modules}
          formats={formats}
          className="mb-12 h-[calc(100vh-36rem)] "
          onChange={handleQuillChange}
          value={content}
        />
        {errors?.content && (
          <p className="text-red-500">This field is required</p>
        )}
        <div className="flex justify-between pt-5">
          <button
            className="mt-4 rounded bg-button px-4 py-2 font-bold text-white hover:bg-buttonHover"
            type="submit"
            onClick={handleSubmit(handlePublish)}
          >
            Publish
          </button>

          <button
            className="mt-4 rounded bg-button px-4 py-2 font-bold text-white hover:bg-buttonHover"
            type="submit"
            onClick={handleSubmit(handleSaveAsDraft)}
          >
            Save as Draft
          </button>
        </div>
      </form>
    </Layout>
  );
};
export default Write;
