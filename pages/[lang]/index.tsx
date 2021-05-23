import gql from "graphql-tag";
import { NextPageContext } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect } from "react";
import styles from "../styles/Home.module.css";
import graphClient from "../../utils/graphClient";

export default function Home({ lang }) {
  useEffect(() => {
    (async () => {
      let { data } = await graphClient.query({
        query: gql`
          query {
            repository(owner: "techiestory", name: "story") {
              object(expression: "HEAD:") {
                ... on Tree {
                  entries {
                    name
                    type
                    object {
                      ... on Blob {
                        byteSize
                      }

                      # One level down.
                      ... on Tree {
                        entries {
                          name
                          type
                          object {
                            ... on Blob {
                              byteSize
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `,
      });
      console.log(data);
    })();
  }, []);
  return <h1>1</h1>;
}
export async function getServerSideProps(context: NextPageContext) {
  return {
    props: {
      lang: context.query.lang,
    }, // will be passed to the page component as props
  };
}
