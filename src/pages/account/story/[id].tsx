import { useRouter } from "next/router";
// import Markdown from "../../../components/Markdown";
import parse from "html-react-parser";
import MainAccount from "../../../components/account/MainAccount";
import Posts from "../../../data/posts";

const Story = () => {
  const router = useRouter();
  const { id } = router.query;
  const story = Posts.find((story) => story.id === id);
  return (
    <MainAccount>
      <div className="">
        <h1 className="text-title py-5 text-2xl font-[700] md:py-10 md:text-4xl lg:text-5xl">
          {story?.title}
        </h1>
        {/* <ReactMarkdown
          className="foo prose prose-base md:prose-lg"
          // components={Markdown}
          remarkPlugins={[remarkGfm]}
        >
          {story?.content}
        </ReactMarkdown> */}
        <div className="prose md:prose-xl">
          {parse((story?.content as string) || "")}
        </div>
      </div>
    </MainAccount>
  );
};
export default Story;
