import React from "react";
import moment from "moment";
import { CircularProgress, CircularProgressLabel } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useInterval } from "react-use";
import Delete from "./delete";

const Timer = (props: {
  timer: {
    id: number;
    dash: string;
    timerUUID: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    endsAt: string;
    timeLeft: string;
    notify: boolean;
    childLock: boolean;
    paused: boolean;
    rawTime: number;
    rawUnits: string;
  };
}) => {
  const router = useRouter();

  const [delay] = React.useState<number>(1000);
  const [remaining, setRemaining] = React.useState<string>("");
  const [progress, setProgress] = React.useState<number>(0);
  const [isRunning] = React.useState<boolean>(true);

  const [deleteState, setDeleteState] = React.useState<boolean>(false);

  const [isPaused, setIsPaused] = React.useState<boolean>(props.timer.paused);
  const [isRefreshing, setRefreshing] = React.useState<boolean>(false);

  React.useEffect(() => {
    setProgress(
      moment().unix() > moment(props.timer.endsAt).unix()
        ? 100
        : 100 -
            (Math.abs(moment().unix() - moment(props.timer.endsAt).unix()) /
              (Math.abs(moment().unix() - moment(props.timer.endsAt).unix()) +
                moment().unix() -
                moment(props.timer.updatedAt).unix())) *
              100
    );
  }, []);

  useInterval(() => {
    if (!props.timer.paused) {
      setRemaining(
        moment(props.timer.endsAt).diff(moment(), "hours") <= 0 &&
          moment(props.timer.endsAt).diff(moment(), "minutes") <= 0 &&
          moment(props.timer.endsAt).diff(moment(), "seconds") <= 0
          ? "0 : 0 : 0"
          : `${moment(props.timer.endsAt).diff(moment(), "hours")} : ${moment(
              props.timer.endsAt
            ).diff(moment(), "minutes")} : ${
              moment(props.timer.endsAt).diff(moment(), "seconds") % 60
            }`
      );
    }
  }, delay);

  useInterval(() => {
    const currentTime = moment().unix();

    const endingTime = moment(props.timer.endsAt).unix();
    const creationTime = moment(props.timer.updatedAt).unix();

    setProgress(
      moment().unix() > moment(props.timer.endsAt).unix()
        ? 100
        : 100 -
            (Math.abs(currentTime - endingTime) /
              (Math.abs(currentTime - endingTime) +
                currentTime -
                creationTime)) *
              100
    );
  }, delay);

  function togglePause() {
    setIsPaused(!isPaused);

    fetch(
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/api/pause" // REPLACE WITH YOUR URL
        : "https://timerr.vercel.app/api/pause",
      {
        method: "POST",
        body: JSON.stringify({
          uuid: props.timer.timerUUID,
          pausedState: !props.timer.paused,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  function reset() {
    setRefreshing(true);

    fetch(
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/api/reset" // REPLACE WITH YOUR URL
        : "https://timerr.vercel.app/api/reset",
      {
        method: "POST",
        body: JSON.stringify({
          uuid: props.timer.timerUUID,
          createdAt: props.timer.createdAt,
          endsAt: props.timer.endsAt,
          rawTime: props.timer.rawTime,
          rawUnits: props.timer.rawUnits,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then(() => window.location.reload());
  }

  return (
    <>
      <section className="flex flex-row justify-around px-5 p-4">
        <header className="flex flex-col">
          <h1 className="text-3xl font-bold">{props.timer.name}</h1>
          <p className="text-sm">
            Created on: {new Date(props.timer.createdAt).toLocaleDateString()}
          </p>
        </header>
        <section className="flex flex-row space-x-3 justify-center items-center">
          <p className="2xl:text-lg xl:text-lg lg:text-lg text-base">
            {remaining}
          </p>
          <CircularProgress value={Math.trunc(progress)} thickness={7}>
            <CircularProgressLabel>
              {Math.trunc(progress)}%
            </CircularProgressLabel>
          </CircularProgress>

          <button
            className="focus:outline-none"
            onClick={() => router.push(`/id/${props.timer.timerUUID}`)}
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
        </section>
      </section>
      {!props.timer.childLock ? (
        <section className="flex flex-row justify-center space-x-4 border-t border-gray-100 p-4 pt-2">
          {isPaused ? (
            <button
              className="focus:outline-none inline-flex items-center justify-center"
              onClick={() => togglePause()}
            >
              <svg width={24} height={24} fill="none" viewBox="0 0 24 24">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M18.25 12L5.75 5.75V18.25L18.25 12Z"
                />
              </svg>
            </button>
          ) : (
            <button
              className="focus:outline-none inline-flex items-center justify-center"
              onClick={() => togglePause()}
            >
              <svg width={24} height={24} fill="none" viewBox="0 0 24 24">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M15.25 6.75V17.25"
                />
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M8.75 6.75V17.25"
                />
              </svg>
            </button>
          )}
          {isRefreshing ? (
            <button className="focus:outline-none inline-flex items-center justify-center cursor-not-allowed text-gray-400 animate-spin">
              <svg width={24} height={24} fill="none" viewBox="0 0 24 24">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M11.25 4.75L8.75 7L11.25 9.25"
                />
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M12.75 19.25L15.25 17L12.75 14.75"
                />
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M9.75 7H13.25C16.5637 7 19.25 9.68629 19.25 13V13.25"
                />
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M14.25 17H10.75C7.43629 17 4.75 14.3137 4.75 11V10.75"
                />
              </svg>
            </button>
          ) : (
            <button
              className="focus:outline-none inline-flex items-center justify-center"
              onClick={() => reset()}
            >
              <svg width={24} height={24} fill="none" viewBox="0 0 24 24">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M11.25 4.75L8.75 7L11.25 9.25"
                />
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M12.75 19.25L15.25 17L12.75 14.75"
                />
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M9.75 7H13.25C16.5637 7 19.25 9.68629 19.25 13V13.25"
                />
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M14.25 17H10.75C7.43629 17 4.75 14.3137 4.75 11V10.75"
                />
              </svg>
            </button>
          )}
        </section>
      ) : null}

      <Delete
        state={deleteState}
        setDeleteState={setDeleteState}
        selectedTimer={props.timer.timerUUID}
      />
    </>
  );
};

export default Timer;
