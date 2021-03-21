import { useRouter } from "next/router";
import { GetStaticProps, InferGetStaticPropsType, GetStaticPaths } from "next";
import Head from "next/head";
import useSWR from "swr";

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { timer } = params;

  const fetcher = (url) =>
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        uuid: timer,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

  const timerRes = await fetcher(
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/api/read"
      : "https://timerr.vercel.app/api/read"
  );

  return {
    props: {
      timerRes,
    },
    revalidate: 1,
  };
};

const Settings = ({
  props,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const fetcher = (url) =>
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        uuid: timer,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

  const { query, isFallback } = useRouter();
  const { timer } = query as { timer?: string };

  // const { data: db } = useSWR(
  //   process.env.NODE_ENV === "development"
  //     ? "http://localhost:3000/api/read"
  //     : "https://timerr.vercel.app/api/read",
  //   fetcher,
  //   { initialData: props.db }
  // );
  //
  // fetch(
  //   process.env.NODE_ENV === "development"
  //     ? "http://localhost:3000/api/read"
  //     : "https://timerr.vercel.app/api/read",
  //   {
  //     method: "POST",
  //     body: JSON.stringify({
  //       uuid: timer,
  //     }),
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   }
  // ).then((res) => res.json());

  if (isFallback) {
    return (
      <>
        <Head>
          <title>Timerr</title>
        </Head>
        <main>The Timerr settings ID is: Loading...</main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Timerr</title>
      </Head>
      <main>The Timerr settings ID is:{timer}</main>
    </>
  );
};

export default Settings;
