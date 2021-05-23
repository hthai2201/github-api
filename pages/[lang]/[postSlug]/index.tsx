import gql from "graphql-tag";
import { NextPageContext } from "next";
import graphClient from "../../../utils/graphClient";
import _ from "lodash";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import matter from "gray-matter";
const components = {};
export default function Home({ error, source }) {
  if (error) {
    return <div>{error}</div>;
  }
  return <MDXRemote {...source} components={components} />;
}
export async function getServerSideProps(context: NextPageContext) {
  const { lang, postSlug } = context.query;
  let { data } = await graphClient.query({
    query: gql`
      query {
        repository(owner: "techiestory", name: "story") {
          object(expression: "HEAD:${lang}/${postSlug}.md") {
            ... on Blob {
              text
            }
          }
        }
      }
    `,
  });

  let post = _.get(data, "repository.object");
  console.log(post);
  if (!post) {
    return { props: { error: "Post is not founded" } };
  }
  const { content, data: masterData } = matter(post.text);

  const mdxSource = await serialize(content, {
    // Optionally pass remark/rehype plugins
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [],
    },
    scope: masterData,
  });
  return {
    props: {
      content,
      masterData,
      source: mdxSource,
    }, // will be passed to the page component as props
  };
}
// export async function getStaticPaths() {
//   const docs = getAllDocs();

//   return {
//     paths: docs.map((doc) => {
//       return {
//         params: {
//           slug: doc.slug,
//         },
//       };
//     }),
//     fallback: false,
//   };
// }
