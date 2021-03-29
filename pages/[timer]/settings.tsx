import { useState } from "react";
import Head from "next/head";
import moment from "moment";
import { CircularProgress } from "@material-ui/core";

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
  const [progress, setProgressState] = useState(0);
  const [timeRemaining, setRemaining] = useState(props.timeLeft);

  const countdown = setInterval(() => {
    setRemaining(moment(props.endsAt).from(new Date().toUTCString()));

    const currentTime = moment().unix();

    const endingTime = moment(props.endsAt).unix();
    const creationTime = moment(props.createdAt).unix();

    setProgressState(
      100 -
        (Math.abs(currentTime - endingTime) /
          (Math.abs(currentTime - endingTime) + currentTime - creationTime)) *
          100
    );

    // Percentage passed
    console.log(
      "Percentage left: ",
      (Math.abs(currentTime - endingTime) /
        (Math.abs(currentTime - endingTime) + currentTime - creationTime)) *
        100
    );
  }, 1000);

  return (
    <>
      <Head>
        <title>Timerr</title>
      </Head>
      <p className="absolute top-3 left-3 2xl:text-base xl:text-base lg:text-base md:text-sm sm:text-xs text-xs">
        {props.timerUUID}
      </p>
      <main className="absolute w-full h-full flex flex-col justify-center items-center">
        <section className="rounded-lg shadow-lg border border-gray-300">
          <section className="w-96 flex flex-row justify-between px-5 p-4 pb-2">
            <header className="flex flex-col">
              <h1 className="text-3xl font-bold">{props.name}</h1>
              <p className="text-sm">
                Created on: {new Date(props.createdAt).toLocaleDateString()}
              </p>
            </header>
            <section className="flex flex-row space-x-3 justify-center items-center">
              <p>
                {timeRemaining} - {Math.trunc(progress)}%
              </p>
              <CircularProgress
                variant="determinate"
                value={Math.trunc(progress)}
              />
            </section>
          </section>
          <section className="w-96 flex flex-row justify-around border-t border-gray-100 p-4 pt-2">
            {props.childLock ? (
              <div>Pause / Resume</div>
            ) : (
              <div>Pause / Resume / Restart</div>
            )}
          </section>
        </section>
      </main>
    </>
  );
}
