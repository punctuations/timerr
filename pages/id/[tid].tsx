import React, { useEffect, useState } from "react";
import Head from "next/head";
import moment from "moment";
import { motion, AnimatePresence } from "framer-motion";
import { useBoolean, useInterval } from "react-use";
import { useRouter } from "next/router";

import { CountdownComponent } from "@components/countdownApi";
import useSWR from "swr";

export async function getServerSideProps({ params }) {
  const { tid } = params;

  const res = await fetch(
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/api/read"
      : "https://timerr.vercel.app/api/read",
    {
      method: "POST",
      body: JSON.stringify({
        uuid: tid,
      }),
      headers: {
        "Content-Type": "Application/Json",
      },
    }
  );

  const body = await res.json();

  if (body.prisma === null) {
    return {
      props: { prisma: { error: true } },
    };
  } else {
    return {
      props: body.prisma,
    };
  }
}

export default function Timer(props) {
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

  const router = useRouter();

  const { tid } = router.query;

  const fetcher = (url) =>
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        uuid: tid,
      }),
      headers: {
        "Content-Type": "Application/Json",
      },
    }).then((r) => r.json());
  const { data } = useSWR(
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/api/read"
      : "https://timerr.vercel.app/api/read",
    fetcher,
    {
      initialData: props,
      revalidateOnFocus: true,
      refreshInterval: 500,
    }
  );

  const timer = data.prisma ? data.prisma : props;

  const [progress, setProgressState] = useState(0);

  const [state, setState] = useBoolean(false);
  const [delay] = useState(1000);

  const [success, setSuccess] = useBoolean(false);

  const [notified, setNotified] = useState<boolean>(false);
  const [messageDisplayed, setMessageDisplayed] = useState<boolean>(false);

  useEffect(() => {
    setProgressState(
      moment().unix() > moment(timer.endsAt).unix()
        ? 100
        : 100 -
            (Math.abs(moment().unix() - moment(timer.endsAt).unix()) /
              (Math.abs(moment().unix() - moment(timer.endsAt).unix()) +
                moment().unix() -
                moment(props.updatedAt).unix())) *
              100
    );
  }, []);

  useInterval(() => {
    if (!props.paused) {
      const currentTime = moment().unix();

      const endingTime = moment(timer.endsAt).unix();
      const creationTime = moment(props.updatedAt).unix();

      setProgressState(
        moment().unix() > moment(timer.endsAt).unix()
          ? 100
          : 100 -
              (Math.abs(currentTime - endingTime) /
                (Math.abs(currentTime - endingTime) +
                  currentTime -
                  creationTime)) *
                100
      );
    }

    if (!messageDisplayed) {
      setMessageDisplayed(true);
      setState(Math.trunc(progress) === 100);
    }
  }, delay);

  if (Math.trunc(progress) == 100 && !notified && props.notify) {
    setNotified(true);
    if (!window.Notification) {
      alert("Timer finished!");
    } else {
      if (Notification.permission === "granted") {
        new Notification("Timer has finished!");
      } else {
        Notification.requestPermission()
          .then((p: NotificationPermission) => {
            if (p === "granted") {
              new Notification("Timer has finished!");
            } else {
              alert("Timer has finished!");
            }
          })
          .catch((e) => {
            console.log(e);
          });
      }
    }
  }

  function deleteTimer() {
    fetch(
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/api/delete" // REPLACE WITH YOUR URL
        : "https://timerr.vercel.app/api/delete",
      {
        method: "POST",
        body: JSON.stringify({
          uuid: props.timerUUID,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((r) => setSuccess(r.success))
      .then(() => router.push("/"));
  }

  return (
    <>
      <Head>
        <title>Timerr</title>
      </Head>

      {props.prisma?.error ? (
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
                Looks like the timer you tried to reach doesn't exist or has
                been deleted!
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
          <p className="absolute top-3 left-3 2xl:text-base xl:text-base lg:text-base md:text-sm sm:text-xs text-xs">
            {props.timerUUID}
          </p>
          <main className="absolute w-full h-full flex justify-center items-center">
            <section className="relative flex flex-col space-y-6 justify-center items-center border border-gray-300 p-4 rounded-lg shadow-lg">
              {Math.trunc(progress) === 100 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute -top-2 -left-2 h-5 w-5 text-blue-600 cursor-pointer"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  onClick={() => setState(true)}
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : null}
              <AnimatePresence initial={false}>
                {state ? (
                  <motion.div
                    className="fixed z-10 inset-0 overflow-y-auto"
                    aria-labelledby="modal-title"
                    role="dialog"
                    aria-modal="true"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                      {/*Background overlay, show/hide based on modal state.*/}

                      {/*Entering: "ease-out duration-300"*/}
                      {/*  From: "opacity-0"*/}
                      {/*  To: "opacity-100"*/}
                      {/*Leaving: "ease-in duration-200"*/}
                      {/*  From: "opacity-100"*/}
                      {/*  To: "opacity-0"*/}

                      <div
                        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                        aria-hidden="true"
                      />

                      <span
                        className="hidden sm:inline-block sm:align-middle sm:h-screen"
                        aria-hidden="true"
                      >
                        &#8203;
                      </span>

                      {/*Entering: "ease-out duration-300"*/}
                      {/*  From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"*/}
                      {/*  To: "opacity-100 translate-y-0 sm:scale-100"*/}
                      {/*Leaving: "ease-in duration-200"*/}
                      {/*  From: "opacity-100 translate-y-0 sm:scale-100"*/}
                      {/*  To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"*/}

                      <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                          <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                              {/* Heroicon name: outline/exclamation */}

                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-red-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                />
                              </svg>
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                              <h3
                                className="text-lg leading-6 font-medium text-gray-900"
                                id="modal-title"
                              >
                                Timer has finished!
                              </h3>
                              <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                  This timer has finished and is no-longer being
                                  used would you like to delete it? This action
                                  cannot be undone and is permanent.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                          {success ? (
                            <button
                              type="button"
                              disabled
                              className="inline-flex w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-400 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-300 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                              <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </svg>{" "}
                              Deleting...
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                              onClick={() => deleteTimer()}
                            >
                              Delete
                            </button>
                          )}

                          {success ? (
                            <button
                              type="button"
                              disabled
                              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-200 shadow-sm px-4 py-2 bg-gray-100 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                              Cancel
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                              onClick={() => setState(false)}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <header className="flex flex-col items-center justify-center px-14">
                <h1 className="text-3xl font-bold">{props.name}</h1>
                <p className="text-sm">
                  Created on: {new Date(props.createdAt).toLocaleDateString()}
                </p>
              </header>
              <CountdownComponent
                UUID={props.timerUUID}
                createdAt={props.createdAt}
                rawTime={props.rawTime}
                rawUnits={props.rawUnits}
                endsAt={timer.endsAt}
                paused={timer.paused}
                childLock={props.childLock}
                orientation={true}
              />
            </section>
          </main>
        </>
      )}
    </>
  );
}
