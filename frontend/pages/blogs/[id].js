import dayjs from "dayjs";
import parse from "html-react-parser";
import Image from "next/image";

import { client } from "../../axios-config";
import { path } from "../../config";

const Blog = ({ blog }) => {
  return (
    <>
      <div className="mx-auto max-w-[850px] px-8 sm:px-12">
        <div className="mt-14 mb-5 flex items-center gap-2">
          <div className="avatar">
            <div className="w-14">
              <Image
                src={path(blog.author.photo)}
                alt="author profile picture"
                layout="fill"
                className="rounded-full"
              />
            </div>
          </div>
          <div>
            <div className="mt-1 font-bold">{blog.author.name}</div>
            <div className="text-sm leading-6">
              {dayjs(blog.date_created).format("D MMMM YYYY hh:mm A")}
            </div>
          </div>
        </div>
        <h1 className="text-3xl font-bold sm:text-4xl">{blog.title}</h1>
        <div className="relative mt-5 h-52 sm:h-72 md:h-[27rem]">
          <Image
            src={path(blog.thumbnail)}
            layout="fill"
            className="rounded-sm object-cover"
            alt="blog thumbnail"
          />
        </div>
        <div className="mt-7" style={{ fontFamily: "'Lora', serif" }}>
          {parse(blog.description)}
        </div>
        <hr className="my-5" />
        <div className="h-20 sm:h-10"></div>
      </div>
    </>
  );
};

export default Blog;

export async function getStaticPaths() {
  const { data } = await client.get("blogs/");
  const paths = data.map((blog) => {
    return {
      params: { id: blog.uuid },
    };
  });
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const { data } = await client.get(`blogs/${params.id}/`);
  return {
    props: { blog: data },
  };
}
