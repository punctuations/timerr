import Head from "next/head";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";
import { CountdownComponent } from "@components/countdownApi";
import Delete from "@components/delete";

export async function getServerSideProps({ params }) {
  const { did } = params;

  const res = await fetch(
    process.env.NODE_ENV === "development"
      ? "http://0.0.0.0:3000/api/dash"
      : "https://timerr.vercel.app/api/dash",
    {
      method: "POST",
      body: JSON.stringify({
        dashUUID: did,
      }),
      headers: {
        "Content-Type": "Application/Json",
      },
    }
  );

  const body = await res.json();

  return {
    props: body,
  };
}

export default function Dashboard(props) {
  const router = useRouter();

  const { did } = router.query;

  const fetcher = (url) =>
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        dashUUID: did,
      }),
      headers: {
        "Content-Type": "Application/Json",
      },
    }).then((r) => r.json());

  const { data } = useSWR(
    process.env.NODE_ENV === "development"
      ? "http://0.0.0.0:3000/api/dash"
      : "https://timerr.vercel.app/api/dash",
    fetcher,
    {
      initialData: props,
      revalidateOnFocus: true,
      refreshInterval: 500,
    }
  );

  const timer = data.supabase ? data : props;

  const timers = data.supabase
    ? data.supabase.sort((a, b) => {
        return a.id - b.id;
      })
    : props.supabase.sort((a, b) => {
        return a.id - b.id;
      });

  const container = {
    init: { opacity: 0, y: 10 },
    enter: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.48, 0.15, 0.25, 0.96],
        staggerChildren: 0.45,
      },
    },
  };

  const subContainer = {
    init: { opacity: 0, y: 5 },
    enter: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.48, 0.15, 0.25, 0.96],
        staggerChildren: 0.5,
      },
    },
  };

  const item = {
    init: { opacity: 0, y: 5 },
    enter: { opacity: 1, y: 0 },
  };

  const [deleteState, setDeleteState] = React.useState<boolean>(false);

  return (
    <>
      <Head>
        <title>Timerr</title>
      </Head>

      {props.supabase[0] === undefined ? (
        <main className="absolute w-full h-full grid place-content-center">
          <motion.section
            variants={container}
            initial="init"
            animate="enter"
            className="rounded-lg shadow-xl px-7 py-3 flex flex-row space-x-10 items-center justify-center"
          >
            <h1 className="text-5xl">😔</h1>
            <div className="flex flex-col space-y-3">
              <h3 className="text-3xl">Uh oh!</h3>
              <p>
                Looks like the dashboard you tried to reach doesn't exist or has
                no more timers left!
              </p>
              <button
                onClick={() => router.push("/create")}
                className="focus:outline-none self-center justify-self-center rounded-lg border duration-500 transition-colors border-gray-200 hover:border-blue-500 hover:text-blue-500 px-4 py-2 2xl:w-1/3 xl:w-1/3 lg:w-1/3 md:w-1/3 w-2/3"
              >
                Create one &rarr;
              </button>
            </div>
          </motion.section>
        </main>
      ) : (
        <>
          {" "}
          <p className="absolute top-3 left-3 2xl:text-base xl:text-base lg:text-base md:text-sm sm:text-xs text-xs">
            {props.supabase[0].dash}
          </p>
          <main className="absolute w-full h-full flex flex-col justify-center items-center space-y-6">
            <motion.section
              className="flex flex-col justify-center items-center space-y-10"
              variants={container}
              initial="init"
              animate="enter"
            >
              <motion.header
                variants={subContainer}
                className="flex flex-col items-center"
              >
                <motion.h1 variants={item} className="text-6xl font-semibold">
                  Dashboard
                </motion.h1>
                <motion.p variants={item}>
                  Welcome to the dashboard, you can get started below to begin!
                </motion.p>
              </motion.header>
            </motion.section>
            <pre>{JSON.stringify(timer.supabase, null, 2)}</pre>

            {timers.map((timer, i) => {
              return (
                <motion.section
                  key={i}
                  variants={container}
                  initial="init"
                  animate="enter"
                  className="2xl:w-1/3 xl:w-1/3 lg:w-1/2 md:w-1/2 sm:w-2/3 w-5/6 rounded-lg shadow-lg border border-gray-300"
                >
                  <section className="flex flex-row justify-around px-5 p-4">
                    <header className="flex flex-col">
                      <h1 className="text-3xl font-bold">{timer.name}</h1>
                      <p className="2xl:text-sm xl:text-sm lg:text-sm text-xs">
                        Created on:{" "}
                        {new Date(timer.createdAt).toLocaleDateString()}
                      </p>
                    </header>
                    <CountdownComponent
                      key={i}
                      UUID={timer.timerUUID}
                      createdAt={timer.createdAt}
                      rawTime={timer.rawTime}
                      rawUnits={timer.rawUnits}
                      endsAt={timer.endsAt}
                      paused={timer.paused}
                      childLock={timer.childLock}
                    >
                      <button
                        className="focus:outline-none"
                        onClick={() => router.push(`/id/${timer.timerUUID}`)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-500 duration-200 transition-colors hover:text-gray-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                          <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                        </svg>
                      </button>

                      <button
                        className="focus:outline-none"
                        onClick={() => setDeleteState(true)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-red-500 duration-200 transition-colors hover:text-red-600"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </CountdownComponent>
                  </section>

                  <Delete
                    state={deleteState}
                    setDeleteState={setDeleteState}
                    selectedTimer={timer.timerUUID}
                  />
                </motion.section>
              );
            })}

            <motion.button
              variants={container}
              initial="init"
              animate="enter"
              className="2xl:w-1/4 xl:w-1/4 lg:w-1/3 md:w-1/3 w-1/2 transition-colors duration-300 border-gray-200 hover:border-blue-500 hover:text-blue-500 border p-5 rounded-md flex items-center justify-center shadow-md focus:outline-none"
              onClick={() => router.push(`/${props.supabase[0].dash}/create`)}
            >
              Create new &rarr;
            </motion.button>
          </main>
        </>
      )}
    </>
  );
}
