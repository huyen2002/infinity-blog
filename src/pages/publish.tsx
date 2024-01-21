import { UploadButton } from "@uploadthing/react";
import "@uploadthing/react/styles.css";
import { type NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import Layout from "~/components/Layout";
import LoadingScreen from "~/components/LoadingScreen";
import Navbar from "~/components/Navbar";
import type { OurFileRouter } from "~/server/uploadthing";
import { api } from "~/utils/api";
const Publish: NextPage = () => {
  const router = useRouter();

  const { data: topics, isFetching } = api.topic.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  // const [filteredTopics, setFilteredTopics] = useState<Topic[]>([]);
  const [inputValue, setInputValue] = useState<string>(topics?.[0]?.name || "");

  // const handleFilteredTopics = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setInputValue(e.target.value);
  //   const filtered = topics?.filter((topic) =>
  //     topic.name.toLowerCase().startsWith(e.target.value.toLowerCase())
  //   );
  //   setFilteredTopics(filtered || []);
  // };

  const [featuredImage, setFeaturedImage] = useState<string>("");

  const mutationPublish = api.post.publish.useMutation({
    async onSuccess() {
      await router.push("/home");
      toast.success("Published successfully");
    },
  });
  const mutationPublishDraft = api.post.publishDraft.useMutation({
    async onSuccess() {
      await router.push("/home");
      toast.success("Published successfully");
    },
  });
  const handlePublish = () => {
    console.log("topic", inputValue);
    if (router.query.id === undefined) {
      mutationPublish.mutate({
        title: router.query.title as string,
        description: router.query.description as string,
        content: router.query.content as string,
        topic: inputValue,
        feature: featuredImage,
      });
    } else {
      mutationPublishDraft.mutate({
        id: router.query.id as string,
        topic: inputValue,
      });
    }
  };

  return (
    <Layout>
      <Navbar />
      {!isFetching ? (
        <div className="mt-10 flex gap-48">
          <div className="flex flex-col gap-5">
            <h1 className="text-xl font-bold text-textNavbar">Story Feature</h1>
            {/* <input
            type="file"
            id="feature"
            name="feature"
            onChange={onSelectFile}
          /> */}
            <UploadButton<OurFileRouter>
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                // Do something with the response
                setFeaturedImage(res ? (res[0]?.fileUrl as string) : "");
                // alert("Upload Completed");
              }}
              onUploadError={(error: Error) => {
                alert(`ERROR! ${error.message}`);
              }}
            />
            {featuredImage ? (
              <Image
                src={featuredImage}
                alt="feature"
                width={300}
                height={300}
                className="h-56 w-96 rounded-md object-cover"
              />
            ) : (
              <div className="h-56 w-96 rounded-md bg-gray-200"></div>
            )}
          </div>
          <div className="flex w-96 flex-col gap-5 ">
            <h1 className="text-xl font-bold text-textNavbar">Topic</h1>
            <p className="text-textBio">
              Add or change topics (up to 5) so readers know what your story is
              about
            </p>
            <div className="w-full">
              {/* <input
              type="text"
              placeholder="Add topic..."
              onChange={handleFilteredTopics}
              value={inputValue}
              className="w-full rounded-md border p-2 outline-none"
            />
            {filteredTopics.length > 0 &&
              inputValue.length > 0 &&
              filteredTopics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => setInputValue(topic.name)}
                  className="mt-1 flex w-48 items-center justify-between rounded-md border p-2 text-sm  shadow-md"
                >
                  <p className="text-textNavbar">{topic.name}</p>
                </button>
              ))} */}
              <select
                id="topics"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                onChange={(e) => setInputValue(e.target.value)}
                defaultValue={topics?.[0].name}
              >
                {topics &&
                  topics.map((topic) => (
                    <option
                      key={topic.id}
                      value={topic.name}
                      className="text-textNavbar"
                    >
                      {topic.name}
                    </option>
                  ))}
              </select>
            </div>

            <button
              onClick={handlePublish}
              className="mt-32 w-28 rounded-2xl bg-button p-2 text-sm text-white hover:bg-buttonHover"
            >
              {mutationPublish.isLoading && (
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
              Publish now
            </button>
          </div>
        </div>
      ) : (
        <LoadingScreen />
      )}
    </Layout>
  );
};
export default Publish;
