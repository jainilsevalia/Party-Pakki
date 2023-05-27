import { useState } from "react";

import dayjs from "dayjs";
import parse from "html-react-parser";
import Image from "next/image";
import Link from "next/link";
import { FcDocument } from "react-icons/fc";

import { client } from "../../axios-config";
import { path } from "../../config";

const Blogs = ({ blogs }) => {
  const descriptionStyle = {
    display: "-webkit-box",
    WebkitLineClamp: 5,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
    marginTop: ".5rem",
    fontFamily: "'Lora', serif",
  };

  const [noOfBlogs, setNoOfBlogs] = useState(10);
  return (
    <>
      <div className="custom-container px-8 sm:px-12">
        <h1 className="mt-14 text-4xl font-bold">Blogs</h1>
        <div className="mt-4 mb-8 border-b-2" />
        <section>
          {blogs.length > 0 ? (
            <div className="mt-8 flex max-w-5xl flex-col gap-2">
              {blogs.slice(0, noOfBlogs).map((blog) => (
                <div className="border-b-2 pb-5" key={blog.uuid}>
                  {/* author and date  */}
                  <div className="mb-4 flex items-center gap-2">
                    <div className="avatar">
                      <div className="w-10">
                        <Image
                          src={path(blog.author.photo)}
                          layout="fill"
                          alt="author profile picture"
                          className="rounded-full"
                        />
                      </div>
                    </div>
                    <span>
                      {blog.author.name} •{" "}
                      {dayjs(blog.date_created).format("D MMMM YYYY hh:mm A")}
                    </span>
                  </div>
                  {/* blog detail  */}
                  <div className="flex flex-col gap-6 sm:flex-row">
                    <div className="order-2 sm:order-1">
                      <Link href={`/blogs/${blog.uuid}`} passHref>
                        <h2 className="cursor-pointer text-2xl font-bold hover:text-sky-700 hover:underline">
                          {blog.title}
                        </h2>
                      </Link>
                      <div style={descriptionStyle}>
                        {parse(blog.description)}
                      </div>
                    </div>
                    <div className="relative order-1 h-44 shrink-0 sm:order-2 sm:w-60">
                      <Image
                        src={path(blog.thumbnail)}
                        layout="fill"
                        className="w-full rounded-sm object-cover"
                        alt="blog-image"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {blogs.length > noOfBlogs && (
                <div className="flex justify-center">
                  <button
                    className="btn btn-ghost"
                    onClick={() => setNoOfBlogs((number) => number * 2)}
                  >
                    Previous blogs
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-10 flex h-96 flex-col items-center justify-center border-2 border-dashed">
              <FcDocument size={120} />
              <p>No blogs to display</p>
            </div>
          )}
        </section>
        <div className="h-20"></div>
      </div>
    </>
  );
};

export default Blogs;

export async function getStaticProps() {
  const { data, status } = await client.get("blogs/");
  if (status === 200) {
    return {
      props: { blogs: data },
    };
  } else {
    return {
      props: { blogs: [] },
    };
  }
}
