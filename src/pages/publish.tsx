import { type Topic } from "@prisma/client";
import { UploadButton } from "@uploadthing/react";
import "@uploadthing/react/styles.css";
import { type NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import Layout from "~/components/Layout";
import Navbar from "~/components/Navbar";
import type { OurFileRouter } from "~/server/uploadthing";
import { api } from "~/utils/api";
const Publish: NextPage = () => {
  const router = useRouter();
  console.log(router.query.title);

  const { data: topics } = api.topic.getAll.useQuery();
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  const handleFilteredTopics = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    const filtered = topics?.filter((topic) =>
      topic.name.toLowerCase().startsWith(e.target.value.toLowerCase())
    );
    setFilteredTopics(filtered || []);
  };

  const [featuredImage, setFeaturedImage] = useState<string>("");

  const mutationPublish = api.post.publish.useMutation();
  const mutationPublishDraft = api.post.publishDraft.useMutation();
  console.log(router.query.id);
  const handlePublish = () => {
    // console.log("publish");
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
              console.log("Files: ", res);
              setFeaturedImage(res ? (res[0]?.fileUrl as string) : "");
              alert("Upload Completed");
            }}
            onUploadError={(error: Error) => {
              // Do something with the error.
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
            <input
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
              ))}
          </div>

          <button
            onClick={handlePublish}
            className="mt-32 w-28 rounded-2xl bg-button p-2 text-sm text-white hover:bg-buttonHover"
          >
            Publish now
          </button>
        </div>
      </div>
    </Layout>
  );
};
export default Publish;
