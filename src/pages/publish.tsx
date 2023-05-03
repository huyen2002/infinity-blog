import { type Topic } from "@prisma/client";
import { type NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "~/components/Layout";
import Navbar from "~/components/Navbar";
import { api } from "~/utils/api";
const Publish: NextPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [preview, setPreview] = useState<string>();
  const router = useRouter();
  console.log(router.query.title);
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objUrl = URL.createObjectURL(selectedFile);
    setPreview(objUrl);

    return () => URL.revokeObjectURL(objUrl);
  }, [selectedFile]);

  const onSelectFile = (e: React.FormEvent<HTMLInputElement>) => {
    const files = (e.target as HTMLInputElement).files;
    if (files === null || files.length === 0) {
      setSelectedFile(undefined);
      return;
    }
    setSelectedFile(files[0]);
  };

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
          <input
            type="file"
            id="feature"
            name="feature"
            onChange={onSelectFile}
          />
          {selectedFile ? (
            <Image
              src={preview || ""}
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
