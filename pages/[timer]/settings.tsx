import { useRouter } from "next/router";
import Head from "next/head";

export async function getServerSideProps({ params }) {
  const { timer } = params;

  const res = await fetch(
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/api/read"
      : "https://timerr.vercel.app/api/read",
    {
      method: "POST",
      body: JSON.stringify({
        uuid: timer,
      }),
      headers: {
        "Content-Type": "Application/Json",
      },
    }
  );

  const body = await res.json();

  return {
    props: body.prisma,
  };
}

export default function Settings(props) {
  return (
    <>
      <Head>
        <title>Timerr</title>
      </Head>
      <main>
        <p>The Timerr settings ID is: {props.timerUUID}</p>
        <p>This Timerr has the name: {props.name}</p>
        <p>
          It was created on: {new Date(props.createdAt).toLocaleDateString()}
        </p>
      </main>
    </>
  );
}
