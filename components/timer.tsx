import React from "react";
import { useRouter } from "next/router";
import Delete from "./delete";

import { CountdownComponent } from "./countdownApi";

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

  const [deleteState, setDeleteState] = React.useState<boolean>(false);
  return (
    <>
      <section className="flex flex-row justify-around px-5 p-4">
        <header className="flex flex-col">
          <h1 className="text-3xl font-bold">{props.timer.name}</h1>
          <p className="2xl:text-sm xl:text-sm lg:text-sm text-xs">
            Created on: {new Date(props.timer.createdAt).toLocaleDateString()}
          </p>
        </header>
        <CountdownComponent
          UUID={props.timer.timerUUID}
          createdAt={props.timer.createdAt}
          rawTime={props.timer.rawTime}
          rawUnits={props.timer.rawUnits}
          endsAt={props.timer.endsAt}
          paused={props.timer.paused}
          childLock={props.timer.childLock}
        >
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
        </CountdownComponent>
      </section>

      <Delete
        state={deleteState}
        setDeleteState={setDeleteState}
        selectedTimer={props.timer.timerUUID}
      />
    </>
  );
};

export default Timer;
