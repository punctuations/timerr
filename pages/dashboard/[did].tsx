import Head from "next/head";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { CircularProgress } from "@material-ui/core";
import { useState } from "react";
import { useBoolean, useInterval } from "react-use";
import moment from "moment";

export async function getServerSideProps({ params }) {
  const { did } = params;

  const res = await fetch(
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/api/dash"
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

  const router = useRouter();

  const [progress, setProgressState] = useState(0);
  const [timeRemaining, setRemaining] = useState(props.timeLeft);

  const [state, setState] = useBoolean(false);
  const [delay] = useState(500);
  const [isRunning, toggleIsRunning] = useBoolean(true);

  const [manual, setManualDelete] = useBoolean(false);

  const [success, setSuccess] = useBoolean(false);

  useInterval(
    () => {
      setRemaining(moment(props.endsAt).from(new Date().toUTCString()));

      const currentTime = moment().unix();

      const endingTime = moment(props.endsAt).unix();
      const creationTime = moment(props.createdAt).unix();

      setProgressState(
        moment().unix() > moment(props.endsAt).unix()
          ? 100
          : 100 -
              (Math.abs(currentTime - endingTime) /
                (Math.abs(currentTime - endingTime) +
                  currentTime -
                  creationTime)) *
                100
      );

      toggleIsRunning(Math.trunc(progress) !== 100);
      setState(Math.trunc(progress) === 100);
    },
    isRunning ? delay : null
  );

  if (Math.trunc(progress) == 100) {
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

  function deleteTimer(i) {
    fetch(
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/api/delete" // REPLACE WITH YOUR URL
        : "https://timerr.vercel.app/api/delete",
      {
        method: "POST",
        body: JSON.stringify({
          uuid: props.prisma[i].timerUUID,
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

  const timers = [];

  for (const i in props.prisma) {
    if (props.prisma.hasOwnProperty(i)) {
      timers.push(
        <>
          <section className="flex flex-row justify-between px-5 p-4 pb-2">
            <header className="flex flex-col">
              <h1 className="text-3xl font-bold">{props.prisma[i].name}</h1>
              <p className="text-sm">
                Created on:{" "}
                {new Date(props.prisma[i].createdAt).toLocaleDateString()}
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-red-500 hover:text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                onClick={() => setManualDelete(true)}
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </section>
          </section>
          <section className="flex flex-row justify-around border-t border-gray-100 p-4 pt-2">
            {!props.prisma[i].childLock ? (
              <div className="inline-flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>{" "}
                /{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>{" "}
              </div>
            ) : null}
          </section>
        </>
      );
    }
  }

  return (
    <>
      <Head>
        <title>Timerr</title>
      </Head>
      <p className="absolute top-3 left-3 2xl:text-base xl:text-base lg:text-base md:text-sm sm:text-xs text-xs">
        {props.prisma[0].dash}
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
              Your timer has just been created, where would you like to go from
              here?
            </motion.p>
          </motion.header>
        </motion.section>
        {timers.map((content) => {
          return (
            <motion.section
              variants={container}
              initial="init"
              animate="enter"
              className="w-1/4 rounded-lg shadow-lg border border-gray-300"
            >
              {content}
            </motion.section>
          );
        })}

        <AnimatePresence initial={false}>
          {state || manual ? (
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

                        {Math.trunc(progress) !== 100 ? (
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
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        ) : (
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
                        )}
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3
                          className="text-lg leading-6 font-medium text-gray-900"
                          id="modal-title"
                        >
                          {Math.trunc(progress) !== 100
                            ? "Are you sure you want to to delete the timer?"
                            : "Timer has finished!"}
                        </h3>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            {Math.trunc(progress) !== 100
                              ? "The Timer once deleted will be deleted and can not be done, this action is permanent."
                              : "This timer has finished and is no-longer being use would you like to delete it? This action cannot be undone and is permanent."}
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
      </main>
    </>
  );
}
