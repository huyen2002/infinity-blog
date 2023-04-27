import parse from "html-react-parser";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import Content from "../../components/Content";
import Layout from "../../components/Layout";
import Navbar from "../../components/Navbar";
import RightContent from "../../components/RightContent";
import Comments from "../../components/comments/Comments";
import Posts from "../../data/posts";

const Post = () => {
  const router = useRouter();
  const { id } = router.query;
  const post = Posts.find((post) => post.id === id);

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isReported, setIsReported] = useState(false);
  return (
    <Layout>
      <Navbar />
      <Content>
        <div className="scrollbar-hide flex h-screen flex-col overflow-y-scroll">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <Image
                src={post?.avatar || ""}
                alt="author"
                width={40}
                height={40}
                className="h-12 w-12 rounded-full object-cover md:h-14 md:w-14"
              />
              <div className="flex flex-col gap-1">
                <div className="flex gap-5">
                  <h1 className="text-lg font-medium md:text-2xl">
                    {post?.author}
                  </h1>
                  <button className="bg-button hover:bg-buttonHover rounded-2xl px-2 py-2 text-sm text-white md:hidden">
                    Follow
                  </button>
                </div>

                <span className="text-textBio text-base font-normal md:text-xl">
                  {post?.publishedAt}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-10 pl-2 pt-5 md:pl-0 md:pt-0">
              <button
                title="bookmark"
                className="hidden md:block"
                onClick={() => setIsBookmarked(!isBookmarked)}
              >
                {isBookmarked ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="#757575"
                    className="h-8 w-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="#757575"
                    className="h-8 w-8"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
              <button className="flex items-center gap-1 rounded-xl border px-2 py-1 hover:bg-slate-100 md:hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="#757575"
                  className="text-textBio hover:text-textNavbar h-8 w-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                  />
                </svg>
                <span className="text-textBio text-sm font-normal  md:text-xl">
                  Save
                </span>
              </button>

              <Link href={`./report/${id}`}>
                {!isReported ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="#757575"
                    className="h-8 w-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-8 w-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
              </Link>
            </div>
          </div>

          <div className="">
            <h1 className="text-title py-5 text-2xl font-[700] md:py-10 md:text-4xl lg:text-5xl">
              {post?.title}
            </h1>
            <div className="prose md:prose-xl">
              {parse((post?.content as string) || "")}
            </div>
            <Options />
            <Comments currentUserId="1" />
          </div>
        </div>
        <RightContent>
          <Image
            src={post?.avatar || ""}
            alt="avatar"
            width={768}
            height={432}
            className="h-20 w-20 rounded-full object-cover"
          />
          <h1 className="text-2xl font-medium">{post?.author}</h1>
          <span className=" text-textBio text-lg font-normal">{`${
            post?.followers || ""
          } Followers`}</span>
          <p className=" text-textBio text-lg font-normal">{post?.bio}</p>
          <button
            title="follow"
            className="bg-button hover:bg-buttonHover mt-10 h-10 w-24 rounded-3xl px-2 py-2 text-lg font-normal text-white"
          >
            Follow
          </button>
        </RightContent>
      </Content>
    </Layout>
  );
};

export default Post;

function Options() {
  const [isActive, setIsActive] = useState(false);
  const [countLike, setCountLike] = useState(0);

  return (
    <div className="flex justify-center">
      <div className="fixed bottom-10 flex items-center gap-5 rounded-xl bg-slate-100 px-2 py-1">
        <button
          className="flex items-center gap-1"
          onClick={() => {
            setIsActive(!isActive);
            if (isActive) {
              setCountLike(countLike - 1);
            } else {
              setCountLike(countLike + 1);
            }
          }}
        >
          {isActive ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#757575"
              className="h-8 w-8"
            >
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#757575"
              className="h-8 w-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          )}

          <span className="text-textBio text-lg font-normal">{countLike}</span>
        </button>
        <button className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="#757575"
            className="text-textNavbar h-8 w-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
            />
          </svg>
          <span className="text-textBio text-lg font-normal">Report</span>
        </button>
      </div>
    </div>
  );
}
